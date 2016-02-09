define([], function(){
    
    function Equipo(gente, educador, nombre, grupo, rama){
        this.nombre = nombre;
        
        this.gente = gente;
        
        this.varones = 0;
        this.mujeres = 0;
        
        /*  primero - segundo - tercero - cuarto */
        this.enRama = [0, 0, 0, 0];
       
        
        this.edades = [];
        this.cantEdades = {};
        this.edadPromedio = 0;
        
        
        this.educador = educador;
        
        this.grupo = grupo;
        this.rama = rama;
        
        this.Data();
    }
    
    Equipo.prototype.Data = function(){
        var gente;
        
        for (var i = 0; i < this.gente.length; i++){
            gente = this.gente[i];
            
            this.edadPromedio += gente.edad;
            
            if (gente.sexo === 'v')  this.varones++;
            if (gente.sexo == 'm')   this.mujeres++;
            
            this.enRama[gente.enRama - 1]++;
            
            if (this.edades.indexOf(gente.edad) === -1){
                this.edades.push(gente.edad);
                this.cantEdades[gente.edad] = 0;
            }
            
            this.cantEdades[gente.edad] += 1; 
        }
        
        this.edadPromedio = this.edadPromedio / this.gente.length;
    };
    
    Equipo.prototype.Gente = function() { return this.gente.length; };
    
    return Equipo;
});