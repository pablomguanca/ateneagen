// ============================================================
// Firebase Config & Firestore Service
// ============================================================
// Expone window.AteneaDB para uso desde app.js (IIFE)
// SDK compat cargado via CDN en index.html
//
// Reemplazá los valores de firebaseConfig con los de tu proyecto.
// Mientras tenga valores placeholder, la app funciona sin Firebase
// usando solo localStorage.

(() => {
  const firebaseConfig = {
    apiKey:            'TU_API_KEY',
    authDomain:        'TU_PROYECTO.firebaseapp.com',
    projectId:         'TU_PROYECTO',
    storageBucket:     'TU_PROYECTO.firebasestorage.app',
    messagingSenderId: '000000000000',
    appId:             '1:000000000000:web:xxxxxxxxxxxxxx'
  };

  const PLACEHOLDER = firebaseConfig.apiKey === 'TU_API_KEY';

  if (PLACEHOLDER || typeof firebase === 'undefined') {
    window.AteneaDB = null;
    return;
  }

  try {
    firebase.initializeApp(firebaseConfig);
  } catch (e) {
    console.warn('Firebase no pudo inicializarse:', e.message);
    window.AteneaDB = null;
    return;
  }

  const auth = firebase.auth();
  const db   = firebase.firestore();

  let _unsubSnapshots = [];

  // ----------------------------------------------------------
  // Auth helpers
  // ----------------------------------------------------------

  const getUser = () => auth.currentUser;
  const getUid  = () => { const u = getUser(); if (!u) throw new Error('No autenticado'); return u.uid; };

  const onAuthChange = callback => auth.onAuthStateChanged(callback);

  const signIn = (email, password) => auth.signInWithEmailAndPassword(email, password);

  const signUp = async (email, password, displayName) => {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    if (displayName) await cred.user.updateProfile({ displayName });
    await db.collection('users').doc(cred.user.uid).set({
      email,
      displayName: displayName || '',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return cred;
  };

  const signOut = async () => {
    _limpiarSuscripciones();
    await auth.signOut();
  };

  // ----------------------------------------------------------
  // Proposals CRUD (aislado por userId)
  // ----------------------------------------------------------

  const _colProposals = () => db.collection('proposals');

  const _baseQuery = () =>
    _colProposals()
      .where('userId', '==', getUid())
      .orderBy('createdAt', 'desc');

  const crearPropuesta = async (data) => {
    const uid = getUid();
    const doc = {
      userId:     uid,
      title:      data.title      || '',
      clientName: data.clientName || '',
      amount:     data.amount     || 0,
      status:     'draft',
      theme:      data.theme      || 'elegante-oscuro',
      payload:    data.payload    || {},
      createdAt:  firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:  firebase.firestore.FieldValue.serverTimestamp()
    };
    const ref = await _colProposals().add(doc);
    return ref.id;
  };

  const obtenerPropuesta = async (id) => {
    const snap = await _colProposals().doc(id).get();
    if (!snap.exists) return null;
    const data = snap.data();
    if (data.userId !== getUid()) return null;
    return { id: snap.id, ...data };
  };

  const listarPropuestas = async (limite = 50) => {
    const snap = await _baseQuery().limit(limite).get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  };

  const listarPorEstado = async (status, limite = 50) => {
    const snap = await _colProposals()
      .where('userId', '==', getUid())
      .where('status', '==', status)
      .orderBy('createdAt', 'desc')
      .limit(limite)
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  };

  const actualizarPropuesta = async (id, cambios) => {
    const ref = _colProposals().doc(id);
    const snap = await ref.get();
    if (!snap.exists || snap.data().userId !== getUid()) {
      throw new Error('Propuesta no encontrada o sin permisos');
    }
    delete cambios.userId;
    delete cambios.createdAt;
    cambios.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    await ref.update(cambios);
  };

  const borrarPropuesta = async (id) => {
    const ref = _colProposals().doc(id);
    const snap = await ref.get();
    if (!snap.exists || snap.data().userId !== getUid()) {
      throw new Error('Propuesta no encontrada o sin permisos');
    }
    await ref.delete();
  };

  // ----------------------------------------------------------
  // Suscripción en tiempo real
  // ----------------------------------------------------------

  const escucharPropuestas = (callback) => {
    const unsub = _baseQuery().onSnapshot(snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(docs);
    }, err => {
      console.error('Error en snapshot de propuestas:', err);
    });
    _unsubSnapshots.push(unsub);
    return unsub;
  };

  // ----------------------------------------------------------
  // Limpieza al cerrar sesión
  // ----------------------------------------------------------

  const _limpiarSuscripciones = () => {
    _unsubSnapshots.forEach(fn => fn());
    _unsubSnapshots = [];
  };

  // ----------------------------------------------------------
  // API pública
  // ----------------------------------------------------------

  window.AteneaDB = {
    auth: { getUser, getUid, onAuthChange, signIn, signUp, signOut },
    proposals: {
      crear:      crearPropuesta,
      obtener:    obtenerPropuesta,
      listar:     listarPropuestas,
      listarPor:  listarPorEstado,
      actualizar: actualizarPropuesta,
      borrar:     borrarPropuesta,
      escuchar:   escucharPropuestas
    }
  };
})();
