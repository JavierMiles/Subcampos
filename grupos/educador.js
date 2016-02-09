define([], function(){
    
    function Educador(nombre, edad, educando, enRama, sexo){
        this.nombre = nombre;
        this.edad = edad;
        this.sexo = sexo;
        
        this.educando = educando;
        this.enRama = enRama;
    };
    
    
    return Educador;
    
});