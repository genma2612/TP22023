export class Usuario { //Administrador tiene estos atributos solos

    uid:string|null;
    rol:string|null;
    email:string|null;
    nombre:string;
    apellido:string;
    edad:number;
    dni:number;
    imagenUno:string;
    imagenDos:string;

    constructor(
        uid:string,
        rol:string,
        email:string,
        nombre:string,
        apellido:string,
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
            this.edad = edad;
            this.dni = dni;
            this.imagenUno = imagenUno;
            this.imagenDos = imagenDos;
    }
}

export class Paciente extends Usuario {
    obraSocial:string;
    numAfiliado:number;

    constructor(
        uid:string,
        rol:string,
        email:string,
        nombre:string,
        apellido:string,
        edad:number,
        dni:number,
        imagenUno:string,
        imagenDos:string,
        obraSocial:string,
        numAfiliado:number
    ){
        super(uid,rol,email,nombre,apellido,edad,dni,imagenUno, imagenDos);
        this.obraSocial = obraSocial;
        this.numAfiliado = numAfiliado;
    }
}

export class Especialista extends Usuario {
    especialidades:string[];
    tieneAcceso:boolean;

    constructor(
        uid:string,
        rol:string,
        email:string,
        nombre:string,
        apellido:string,
        edad:number,
        dni:number,
        imagenUno:string,
        imagenDos:string,
        especialidades:string[],
        tieneAcceso:boolean
    ){
        super(uid,rol,email,nombre,apellido,edad,dni,imagenUno,imagenDos);
        this.especialidades = especialidades;
        this.tieneAcceso = tieneAcceso;
    }
}


export interface Turno {
    paciente:Paciente;
    especialista:Especialista;
    estado:string;
    fecha:Date;
    hora:Date;
    reseña:string;
    disponible:boolean;
}
