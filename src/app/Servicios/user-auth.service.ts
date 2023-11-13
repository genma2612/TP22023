import { Usuario, Especialista, Paciente, Turno } from '../Clases/interfaces';
import {
  arrayUnion,
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  getDoc,
  getDocs,
  orderBy,
  where,
  query,
  setDoc,
  updateDoc,
  or,
  Timestamp
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { Storage, ref, uploadBytes, getDownloadURL, listAll } from '@angular/fire/storage';
import * as stringRandom from 'string-random';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private objUsuarioLogueado: any = undefined;

  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage) {
    /* 
    this.auth.onIdTokenChanged(status => {
      if (status != null) {
        // Al chequear que el usuario esté, lo trae de Firestore 
        // Registrar lo guarda al momento de autentificar con Google
        // Luego, lo guarda en en localstorage, cambia los atributos
        // Y guarda el usuario para poder acceder a él desde otros componentes
        this.traerUsuarioDeFirestore(status).then(
          snapshot => {
            this.objUsuarioLogueado = snapshot.data();
            this.saveToLocalstorage(snapshot.data());
            //this.guardarInicioDeSesion(snapshot.data());
          }
        );

      }
      else {
        //console.info('El usuario deslogueó');
        this.objUsuarioLogueado = undefined;
        //localStorage.removeItem('usuarioActual');
        //console.info(this.objUsuarioLogueado);
      }
    })
    */
  }

  //Fire Auth

  registrar({ correo, password }: any) {
    return createUserWithEmailAndPassword(this.auth, correo, password);
  }

  enviarEmailDeVerificacion(user: any) {
    return sendEmailVerification(user);
  }

  ingresar(correo: string, password: string) {
    return signInWithEmailAndPassword(this.auth, correo, password);
  }

  salir() {
    localStorage.removeItem('usuarioActual');
    return signOut(this.auth);
  }

  //Firestore

  updateDocument(collection: string, uid: any, valor: any) {
    const docRef = doc(this.firestore, `${collection}/${uid}`)
    return updateDoc(docRef, { tieneAcceso: valor });
  }

  updateHorario(collection: string, uid: any, valor: any) {
    const docRef = doc(this.firestore, `${collection}/${uid}`)
    return updateDoc(docRef, { horario: valor });
  }

  updateTieneHC(uid: any) {
    console.info('Se cambio a que tiene HC');
    const docRef = doc(this.firestore, `usuarios/${uid}`)
    return updateDoc(docRef, { tieneHC: true });
  }

  updateDuracion(collection: string, uid: any, duracion: number) {
    const docRef = doc(this.firestore, `${collection}/${uid}`)
    return updateDoc(docRef, { duracionTurnos: duracion });
  }

  guardarUsuarioEnFirestore(user: any) { //Para guardar en colección users un documento con el mismo ID del usuario
    const docRef = doc(this.firestore, `usuarios/${user.uid}`)
    return setDoc(docRef, Object.assign({}, user), { merge: true });
    //return setDoc(docRef, user, { merge: true });
    //Object.assign({}, user) para guardar como obj genérico, sino da error
  }

  guardarTurno(turno: Turno) {
    let randomstring = stringRandom(20);
    let turnoParaPacienteFiltrado = JSON.parse(JSON.stringify(turno));      //Hard clone para estructurar cada turno según colección;
    let turnoParaEspecialistaFiltrado = JSON.parse(JSON.stringify(turno));  //Hard clone para estructurar cada turno según colección;
    let turnoGenericObject = JSON.parse(JSON.stringify(turno));             //Hard clone para estructurar cada turno según colección;
    turnoParaPacienteFiltrado.uid = randomstring;
    turnoParaEspecialistaFiltrado.uid = randomstring;
    turnoGenericObject.uid = randomstring;
    turnoParaPacienteFiltrado.fecha = Timestamp.fromDate(new Date(turnoGenericObject.fecha));
    turnoParaEspecialistaFiltrado.fecha = Timestamp.fromDate(new Date(turnoGenericObject.fecha));
    turnoGenericObject.fecha = Timestamp.fromDate(new Date(turnoGenericObject.fecha));

    //Borro campos innecesarios para las colecciones
      //Paciente
    delete turnoParaPacienteFiltrado.paciente;
    delete turnoParaPacienteFiltrado.especialista.dni;
    delete turnoParaPacienteFiltrado.especialista.edad;
    delete turnoParaPacienteFiltrado.especialista.email;
    delete turnoParaPacienteFiltrado.especialista.especialidades;
    delete turnoParaPacienteFiltrado.especialista.horario;
    delete turnoParaPacienteFiltrado.especialista.rol;
    delete turnoParaPacienteFiltrado.especialista.tieneAcceso;

      //Especialista
    delete turnoParaEspecialistaFiltrado.especialista;
    delete turnoParaEspecialistaFiltrado.paciente.email;
    delete turnoParaEspecialistaFiltrado.paciente.imagenDos;
    delete turnoParaEspecialistaFiltrado.paciente.rol;

      //Turno
    delete turnoGenericObject.paciente;
    delete turnoGenericObject.especialista;
    turnoGenericObject.paciente = turnoParaEspecialistaFiltrado.paciente;
    turnoGenericObject.especialista = turnoParaPacienteFiltrado.especialista;
    
    const especialistaRef = doc(this.firestore, `usuarios/${turno.especialista?.uid}/turnos/${turnoGenericObject.uid}`);
    const pacienteRef = doc(this.firestore, `usuarios/${turno.paciente?.uid}/turnos/${turnoGenericObject.uid}`);
    const turnosRef = doc(this.firestore, `turnos/${turnoGenericObject.uid}`);
    return setDoc(turnosRef, turnoGenericObject).then(
      () => {
        setDoc(pacienteRef, turnoParaPacienteFiltrado).then(
          () => setDoc(especialistaRef, turnoParaEspecialistaFiltrado)
        )
        console.info('turno guardado');
      }
    );
  }

  guardarEspecialidad(especialidad: any) {
    const especialidadRef = doc(this.firestore, `especialidades/${especialidad.uid}`);
    return setDoc(especialidadRef, especialidad).then(
      () => {
        console.info('especialidad guardada');
      }
    );
  }

  actualizarEspecialidad(especialidad: any, f: any) {
    const especialidadRef = doc(this.firestore, `especialidades/${especialidad.uid}`);
    return updateDoc(especialidadRef, { nombre: f.nombreEspecialidad }).then(
      () => {
        console.info('especialidad modificada');
      }
    );
  }

  actualizarImagenEspecialidad(especialidad: any, f: any) {
    const especialidadRef = doc(this.firestore, `especialidades/${especialidad.uid}`);
    return updateDoc(especialidadRef, { imagen: f }).then(
      () => {
        console.info('especialidad modificada');
      }
    );
  }

  cambiarHAbilitacionEspecialidad(uid: any, valor: any) {
    const docRef = doc(this.firestore, `especialidades/${uid}`)
    return updateDoc(docRef, { estaHabilitada: valor });
  }

  actualizarEstadoTurno(objeto:any, idTurno: string, idPac: string, idEsp: string) {
    let turnoRef = doc(this.firestore, `turnos/${idTurno}`);
    let pacRef = doc(this.firestore, `usuarios/${idPac}/turnos/${idTurno}`);
    let espRef = doc(this.firestore, `usuarios/${idEsp}/turnos/${idTurno}`);
    return updateDoc(turnoRef, objeto).then(() => {
      updateDoc(pacRef, objeto).then(() => {
        updateDoc(espRef, objeto)
        console.info('Se actualizó el turno en los 3 documentos');
      })
    });
  }

  guardarInicioDeSesion(usuario: any) {
    let ingreso: object = { mail: usuario.mail, uid: usuario.uid, rol: usuario.rol, ingreso: new Date().toLocaleString() };
    const userRef = collection(this.firestore, `ingresos`); //Esto agrega a colección sin ID específica
    return addDoc(userRef, ingreso);
  }

  guardarResultado(resultado: any) {
    let documentoAGuardar = resultado;
    documentoAGuardar.fecha = Timestamp.fromDate(new Date());
    documentoAGuardar.usuario = this.objUsuarioLogueado?.mail;
    documentoAGuardar.rol = this.objUsuarioLogueado?.rol;
    const userRef = collection(this.firestore, `resultados`); //Esto agrega a colección sin ID específica
    return addDoc(userRef, documentoAGuardar);
  }

  traerUsuarioDeFirestore(user: any) {
    let docRef = doc(this.firestore, `usuarios/${user.uid}`);
    return getDoc(docRef);
  }

  getUserFromAuth() {
    return this.auth.currentUser;
  }


  traerColeccion(coleccion: string) { //No sirve como observable, la ordenada utiliza collectionData que se actualiza
    const colRef = collection(this.firestore, coleccion);
    //return from(getDocs(colRef)); //como observable
    return getDocs(colRef); //como promesa
  }

  traerColeccionOrdenada(coleccion: string, orden: string) {
    const colRef = collection(this.firestore, coleccion);
    const q = query(colRef, orderBy(orden));
    return collectionData(q);
  }

  traerColeccionTurnosConDiagnostico(uid:string) {
    const colRef = collection(this.firestore, `usuarios/${uid}/turnos` );
    const q = query(colRef,where("estado", "==", 'Realizado'), orderBy('fecha', 'desc'));
    return collectionData(q);
  }
  
  traerColeccionTurnosCompleta(uid:string) {
    const colRef = collection(this.firestore, `usuarios/${uid}/turnos` );
    const q = query(colRef, orderBy('fecha', 'desc'));
    return collectionData(q);
  }
  
  traerColeccionUsuarios() { //Trae pacientes y especialistas con el funcion/operador OR en la query
    const colRef = collection(this.firestore, 'usuarios');
    const q = query(colRef, or(where("rol", "==", 'paciente'), where("rol", "==", 'especialista')));
    return collectionData(q);
  }

  traerColeccionUsuariosEspecifica(rol: string) { //Trae pacientes y especialistas con el funcion/operador OR en la query
    const colRef = collection(this.firestore, 'usuarios');
    const q = query(colRef, where("rol", "==", rol));
    return collectionData(q);
  }

  getUsuarioLocalstorage() {
    if (localStorage.getItem('usuarioActual') != null)
      return JSON.parse(localStorage.getItem('usuarioActual')!);
    else
      return '';
  }

  saveToLocalstorage(user: any) {
    localStorage.setItem('usuarioActual', JSON.stringify(user));
  }

  deleteFromLocalstorage() {
    localStorage.removeItem('usuarioActual');
  }

  get hayUsuarioLogueado() { //Armar observable para que retorne el usuario logueado?
    return JSON.parse(localStorage.getItem('usuarioActual')!) != null;
  }

  get usuarioLogueado() {
    //return this.objUsuarioLogueado;
    return JSON.parse(localStorage.getItem('usuarioActual')!);
  }

  guardarMensaje(elemento: any) {
    const elementoAGuardar = { usuario: this.usuarioLogueado?.mail, fecha: new Date().toString(), mensaje: elemento }
    const userRef = collection(this.firestore, `mensajes`); //Esto agrega a colección sin ID específica
    return addDoc(userRef, elementoAGuardar);
  }

  guardarEncuesta(elemento: any) {
    const elementoAGuardar = elemento;
    elementoAGuardar.usuario = this.usuarioLogueado;
    elementoAGuardar.fecha = new Date();
    const userRef = collection(this.firestore, `encuestas`); //Esto agrega a colección sin ID específica
    return addDoc(userRef, elementoAGuardar);
  }

  traerTodosLosMensajes() { //detecta cambios
    const colRef = collection(this.firestore, 'mensajes');
    const q = query(colRef, orderBy('fecha')); //Ordena por fecha los mensajes
    return collectionData(q);
  }


  // Storage
  subirImagenes(file: File, folder: string, nombre: string) {
    let path = 'images' + '/' + folder + '/' + nombre;
    const imageRef = ref(this.storage, path);
    return uploadBytes(imageRef, file);
  }

  subirImagenEspecialidad(file: File, folder: string, nombre: string) {
    let path = 'especialidades' + '/' + folder + '/' + nombre;
    const imageRef = ref(this.storage, path);
    return uploadBytes(imageRef, file);
  }

  traerImagen(folder: string, nombre: string) {
    let path = 'images' + '/' + folder + '/' + nombre;
    const imageRef = ref(this.storage, path);
    return getDownloadURL(imageRef);
  }

  traerImagenEspecialidad(folder: string, nombre: string) {
    let path = 'especialidades' + '/' + folder + '/' + nombre;
    const imageRef = ref(this.storage, path);
    return getDownloadURL(imageRef);
  }



}

