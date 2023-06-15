import { Usuario, Especialista, Paciente } from '../Clases/interfaces';
import {
  DocumentData,
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { Storage, ref, uploadBytes, getDownloadURL, listAll } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private isLogged: boolean = false;
  private objUsuarioLogueado: any = undefined;

  constructor(private auth: Auth, private firestore: Firestore, private storage:Storage) {
    this.auth.onAuthStateChanged(status => {
      if (status != null) {
        // Al chequear que el usuario esté, lo trae de Firestore 
        // Registrar lo guarda al momento de autentificar con Google
        // Luego, lo guarda en en localstorage, cambia los atributos
        // Y guarda el usuario para poder acceder a él desde otros componentes



        this.traerUsuarioDeFirestore(status).then(
          snapshot => {
            this.objUsuarioLogueado = snapshot.data();
            this.isLogged = true;
            this.saveToLocalstorage(snapshot.data());
            //this.guardarInicioDeSesion(snapshot.data());
          }
        );

      }
      else {
        this.isLogged = false;
        console.info('El usuario deslogueó');
        this.objUsuarioLogueado = undefined;
        console.info(this.objUsuarioLogueado);
      }
    })
  }

  //Fire Auth

  registrar({ correo, password }: any) {
    return createUserWithEmailAndPassword(this.auth, correo, password);
  }

  ingresar(correo: string, password: string) {
    return signInWithEmailAndPassword(this.auth, correo, password);
  }

  salir() {
    return signOut(this.auth).then(
      () => this.deleteFromLocalstorage()
    );
  }

  //Firestore

  updateDocument(collection:string, uid:any, valor:any){
    const docRef = doc(this.firestore, `${collection}/${uid}`)
    return updateDoc(docRef, { tieneAcceso: valor });
  }

  guardarUsuarioEnFirestore(user: any) { //Para guardar en colección users un documento con el mismo ID del usuario
    const docRef = doc(this.firestore, `usuarios/${user.uid}`)
    return setDoc(docRef, Object.assign({}, user), { merge: true });
    //return setDoc(docRef, user, { merge: true });
    //Object.assign({}, user) para guardar como obj genérico, sino da error
  }

  guardarInicioDeSesion(usuario: any) {
    let ingreso: object = { mail: usuario.mail, uid: usuario.uid, rol: usuario.rol, ingreso: new Date().toLocaleString() };
    const userRef = collection(this.firestore, `ingresos`); //Esto agrega a colección sin ID específica
    return addDoc(userRef, ingreso);
  }

  guardarResultado(resultado: any) {
    let documentoAGuardar = resultado;
    documentoAGuardar.fecha = new Date().toLocaleString();
    documentoAGuardar.usuario = this.objUsuarioLogueado?.mail;
    documentoAGuardar.rol = this.objUsuarioLogueado?.rol;
    const userRef = collection(this.firestore, `resultados`); //Esto agrega a colección sin ID específica
    return addDoc(userRef, documentoAGuardar);
  }

  traerUsuarioDeFirestore(user: any) {
    let docRef = doc(this.firestore, `usuarios/${user.uid}`);
    return getDoc(docRef);
  }


  traerColeccion(coleccion: string) { //No sirve como observable, la ordenada utiliza collectionData que se actualiza
    const colRef = collection(this.firestore, coleccion);
    return from(getDocs(colRef));
    //return getDocs(colRef); //como promesa
  }

  traerColeccionOrdenada(coleccion: string, orden: string) {
    const colRef = collection(this.firestore, coleccion);
    const q = query(colRef, orderBy(orden));
    return collectionData(q);
  }

  getUsuarioLocalstorage() {
    return JSON.parse(localStorage.getItem('usuarioActual')!);
  }

  saveToLocalstorage(user: any) {
    localStorage.setItem('usuarioActual', JSON.stringify(user));
  }

  deleteFromLocalstorage() {
    localStorage.removeItem('usuarioActual');
  }

  get hayUsuarioLogueado() { //Armar observable para que retorne el usuario logueado?
    return this.isLogged;
  }

  get usuarioLogueado() {
    return this.objUsuarioLogueado;
    //return JSON.parse(localStorage.getItem('usuarioActual')!);
  }

  guardarMensaje(elemento: any) {
    const elementoAGuardar = { usuario: this.usuarioLogueado?.mail, fecha: new Date().toString(), mensaje: elemento }
    const userRef = collection(this.firestore, `mensajes`); //Esto agrega a colección sin ID específica
    return addDoc(userRef, elementoAGuardar);
  }

  guardarEncuesta(elemento: any) {
    const elementoAGuardar = elemento;
    elementoAGuardar.usuario = this.usuarioLogueado;
    elementoAGuardar.fecha = new Date().toString();
    const userRef = collection(this.firestore, `encuestas`); //Esto agrega a colección sin ID específica
    return addDoc(userRef, elementoAGuardar);
  }

  traerTodosLosMensajes() { //detecta cambios
    const colRef = collection(this.firestore, 'mensajes');
    const q = query(colRef, orderBy('fecha')); //Ordena por fecha los mensajes
    return collectionData(q);
  }


  // Storage
  subirImagenes(file:File, folder:string, nombre:string){
    let path = 'images' + '/' + folder + '/' + nombre;
    const imageRef = ref(this.storage, path);
    return uploadBytes(imageRef, file);
  }

  traerImagen(folder:string, nombre:string){
    let path = 'images' + '/' + folder + '/' + nombre;
    const imageRef = ref(this.storage, path);
    return getDownloadURL(imageRef);
  }



}

