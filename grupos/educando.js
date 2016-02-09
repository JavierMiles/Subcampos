define([], function(){
    
    function Educando(nombre, apellido, edad, enRama, sexo, equipo, rama, grupo){
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.sexo = sexo;
        
        this.enRama = enRama;
        
        this.equipo = equipo;
        this.rama = rama;
        this.grupo = grupo;
        
    };
    
    
    return Educando;
    
});


//    0       1     2        3         4        5      6          7
//  GRUPO - RAMA- EQUIPO - NOMBRE - APELLIDO - V/M - EDAD - AÑOS EN LA RAMA