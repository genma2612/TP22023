import { Timestamp } from "@angular/fire/firestore";

export class Usuario { //Administrador tiene estos atributos solos

    uid?:string|null;
    rol?:string|null;
    email?:string|null;
    nombre?:string;
    apellido?:string;
    sexo?:string;
    edad?:number;
    dni?:number;
    imagenUno?:string;
    imagenDos?:string;

    constructor(
        uid:string,
        rol:string,
        email:string,
        nombre:string,
        apellido:string,
        sexo:string,
        edad:number,
        dni:number,
        imagenUno:string,
        imagenDos:string
        ){
            this.uid = uid;
            this.rol = rol;
            this.email = email;
            this.nombre = nombre;
            this.apellido = apellido;
            this.sexo = sexo;
            this.edad = edad;
            this.dni = dni;
            this.imagenUno = imagenUno;
            this.imagenDos = imagenDos;
    }
}

export class Paciente extends Usuario {
    obraSocial?:string;
    numAfiliado?:number;

    constructor(
        uid:string,
        rol:string,
        email:string,
        nombre:string,
        apellido:string,
        sexo:string,
        edad:number,
        dni:number,
        imagenUno:string,
        imagenDos:string,
        obraSocial:string,
        numAfiliado:number,
    ){
        super(uid,rol,email,nombre,apellido,sexo,edad,dni,imagenUno, imagenDos);
        this.obraSocial = obraSocial;
        this.numAfiliado = numAfiliado;
        
    }
}

export class Especialista extends Usuario {
    especialidades?:string[];
    tieneAcceso?:boolean;
    horario?:object;
    constructor(
        uid:string,
        rol:string,
        email:string,
        nombre:string,
        apellido:string,
        sexo:string,
        edad:number,
        dni:number,
        imagenUno:string,
        imagenDos:string,
        especialidades:string[],
        horario:object,
        tieneAcceso:boolean,
    ){
        super(uid,rol,email,nombre,apellido,sexo,edad,dni,imagenUno,imagenDos);
        this.especialidades = especialidades;
        this.tieneAcceso = tieneAcceso;
        this.horario = horario;
    }
}


export class Turno {
    paciente?:Paciente;
    especialista?:Especialista;
    estado?:string;
    fecha?:Date;
    //hora:Date;
    reseña?:string;
    comentario?:string;
    calificación?:string;
    disponible?:boolean;
    id?:string;
    duracion?:number;
    especialidadElegida?:string
    constructor(
        paciente:Paciente, 
        especialista:Especialista,
        estado:string,
        fecha:Date,
        //hora:Date,
        reseña:string,
        comentario:string,
        calificación:string,
        disponible:boolean,
        id:string,
        duracion:number,
        especialidadElegida:string
        ){
            this.paciente = paciente;
            this.especialista = especialista;
            this.estado = estado;
            this.fecha = fecha;
            //this.hora = hora;
            this.reseña = reseña;
            this.comentario = comentario;
            this.calificación = calificación;
            this.disponible = disponible;
            this.id = id;
            this.duracion = duracion;
            this.especialidadElegida = especialidadElegida;
        }
}
