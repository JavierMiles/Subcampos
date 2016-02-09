/*
    SEXO (dif) -->
        0% = 10
        25% = 1
        
    EDAD -->
        Promedio
            dif de 0.2 = 10 
            dif de 1 = 1
        
        Desviación <= 20%
*/

var difSexo = 30;

var edadPromedio = 12,
    difEdad = 0.15,
    desviacion = 40;

var deviation = 50,
    difTiempo = 0.5,
    tiempoPromedio = 2;

// GRUPO - SEXO - EDAD - AÑOS EN LA RAMA
var importancia = [10, 4, 3, 1];

define([], function(){
    
    function Evolucion(steps, cant, subcampos, equipos){
        this.steps = steps;
        this.cantCampamentos = cant;
        this.cantSubcampos = subcampos;
        
        //Lista de todos los equipos para el campamento.
        this.equipos = equipos;
        this.cantEquipos = equipos.length;
        
        //Lista de listas. Cada campamento tiene una configuración distinta de subcampos
        this.campamentos = [];
        
        //Los mejores campamentos. Es decir las mejores configuraciones de los subcampos.
        this.mejores = [];
        this.cantMejores = this.cantCampamentos / 4;
        if (this.cantMejores % 2 !== 0)
            this.cantMejores += 1;
        
        
        this.subcampos = [];
        
        this.first = true;
    };
    
    Evolucion.prototype.start = function(){
        this.campamentos = [];
        
        for (var i = 0; i < this.cantMejores; i++)
            this.mejores[i] = [];
        
        this.nuevos(this.cantCampamentos);
        
        this.Run();
    };
    
    Evolucion.prototype.generar = function(){
        this.campamentos = [];
        
        for (var i = 0; i < this.cantMejores; i++)
            this.campamentos.push(this.mejores[i][1]);
        
        this.reproducir();
        this.mutar();
        
        this.nuevos(Math.floor(this.cantCampamentos / 4 + this.cantCampamentos / 8));
       
        //console.log("TODOS");
        //this.escribir();
        
        for (i = 0; i < this.cantMejores; i++)
            this.mejores[i] = [];
        
    };
    
    /*  GENERA NUEVOS CAMPAMENTOS TOTALMENTE AL AZAR
        solo se mutan la mitad de los mejores. Nuevos hay que hacer 1/4 + 1/8*/
    Evolucion.prototype.nuevos = function(n){
        var c = this.cantEquipos / this.cantSubcampos;
        var s, r;
        var ss = [], sa = [];
        
        for (var q = 0; q < this.cantSubcampos; q++)
            for (var i = 0; i < c; i++)
                if (ss.length < this.cantEquipos)
                    ss.push(q + 1);
                else
                    break;

        for (q = 0; q < n; q++){
            s = [];
            for (var i = 0; i < this.cantEquipos; i++){
                r = Math.floor(Math.random() * ss.length);
                r = ss.splice(r, 1);
                s[i] = r[0];
                sa.push(r[0]);
            }
            this.campamentos.push(s);
            
            ss = sa;
            sa = [];
        }
    };
    
    /*  AGARRA TODOS LOS MEJORES CAMPAMENTOS Y LOS HACE TENER HIJITOS   */
    Evolucion.prototype.reproducir = function(){
        var minga = [];
        for (var i = 0; i < this.cantMejores; i++)
            minga.push(this.mejores[i][1]);
        
        
        var r1, r2, r;
        var s1, s2;
        
        while (minga.length > 0){
            r1 = Math.floor(Math.random() * minga.length);
            r1 = minga.splice(r1, 1)[0];
            r1 = r1.slice(0);
            r2 = Math.floor(Math.random() * minga.length);
            r2 = minga.splice(r2, 1)[0];
            r2 = r2.slice(0);
            
            r = Math.floor(Math.random() * (this.cantEquipos * 3 / 4 - this.cantEquipos / 4 + 1) + this.cantEquipos / 4);
            
            s1 = r1.splice(0, r);
            s2 = r2.splice(0, r);
            
            //s1 = s1.concat(r2);
            //s2 = s2.concat(r1);
            
            this.campamentos.push(s1.concat(r2));
            this.campamentos.push(s2.concat(r1));
        }
    };
    
    /*  AGARRA LA MITAD DE LOS MEJORES CAMPAMENTOS Y LOS MUTA.   
        La mutación puede ser cambiando 2, 4, ó 6 equipos   */
    Evolucion.prototype.mutar = function(){
        var s = [];
        var d;
        
        var r1, r2, aux;
        for (var i = 0; i < this.mejores.length / 2; i++){
            
            d = Math.floor(Math.random(0) * 10);
            if (d < 6)
                d = 1;
            else if (d < 9)
                d = 2;
            else
                d = 3;
            
            
            for (var q = 0; q < d; q++){
                r1 = Math.floor(Math.random(0) * this.cantEquipos);
                r2 = Math.floor(Math.random(0) * this.cantEquipos);
                
                s = this.mejores[i][1].slice(0);
                aux = s[r1];
                s[r1] = s[r2];
                s[r2] = aux;
                
                this.campamentos.push(s);
            }
        }
    };
    
    Evolucion.prototype.Run = function(){ 
        for (var i = 0; i < this.steps; i++){  
            
            if (this.first)
                this.first = false;
            else
                this.generar();
            
            
            this.evaluacion();   
        }
        this.escribirMejores();
        //this.escribir();
    };
    
    // EVALÚA TODOS LOS CAMPAMENTOS Y SE QUEDA CON EL 25% MEJOR. LOS METE EN UNA LISTA.
    Evolucion.prototype.evaluacion = function(){
        var s;
        var eval = [], e;
        
        var sub;
        
        /*  GENERA EVAL  
            eval es una lista de la evaluación de cada subcampo del campamento. */
        for (var q = 0; q < this.campamentos.length; q++){
            sub = [];
            for (var i = 0; i < this.cantSubcampos; i++)
                sub.push([]);
            
            s = this.campamentos[q];
            
            for (i = 0; i < s.length; i++)
                if (sub[s[i] - 1] !== undefined)
                sub[s[i] - 1].push(this.equipos[i]);
            
            e = 0;
            for (i = 0; i < this.cantSubcampos; i++)
                e += this.evaluar(sub[i]);
            
            eval.push(e / this.cantSubcampos);
        }
        
        for (q = 0; q < this.cantCampamentos; q++){
            this.mejor(this.campamentos[q], Math.floor(eval[q]));
        }
        
    };
    
    // EVALÚA UN SUBCAMPO Y DEVUELVE EL RESULTADO DE ESE SUBCAMPO. ES UN VALOR ENTRE 0 Y 1. 
    /*
        Cantidad pareja en:
        sexo, edad, años en la rama
        
        subcampo = lista de equipos dentro del subcampo
    */
    Evolucion.prototype.evaluar = function(subcampo){
        var cant = 0;
        
        var v = 0; // varones +1 ; mujeres -1
        var edades = {},
            indexEdades = [];
        
        var enRama = [0, 0, 0, 0];
        
        
        var e;
        var equipos = [], mismos = false;    
        /* EVALÚO UN SÓLO EQUIPO */
        
        for (var i = 0; i < subcampo.length; i++){
            e = subcampo[i];
            
            cant += e.Gente();
            v += e.varones - e.mujeres;
            
            for (var t = 0; t < 4; t++)
                enRama[t] += e.enRama[t];
            
            var ed = 0;
            for (t = 0; t < e.edades.length; t++){
                ed = e.edades[t];
                
                if (indexEdades.indexOf(ed) === -1)
                    indexEdades.push(ed);
                edades[ed] = edades[ed] === undefined ? e.cantEdades[ed] : edades[ed] + e.cantEdades[ed];
            }
            
            if (equipos.indexOf(e.grupo) === -1)
                equipos.push(e.grupo);
            else
                mismos = true;
        }
        
        var ev = [];

        /*  Evalúa si hay dos equipos del mismo grupo en el subcampo    */
        if (mismos)
            ev.push(1);
        else
            ev.push(10);
        
        /*  Evalúa la variedad entre sexos. Cuanto más parejo mejor
            la escala va entre 10 y 1
            25% de diferencia ya es un 1    */
        var a = 0;
        a = Math.abs(v) * 100 / cant;//     cant * 100 / v; 
        a = a >= difSexo ? 1 : 10 - (a * 9 / difSexo); 
        ev.push(a);

        /*  Promedio y desviación estándar entre las edades.    */
        var p = 0;
        for (i = 0; i < indexEdades.length; i++)
            p += indexEdades[i] * edades[indexEdades[i]];

        p = p / cant;

        var s = 0;
        for (i = 0; i < indexEdades.length; i++)
            s += indexEdades[i] * Math.pow((edades[indexEdades[i]] - p), 2);

        s = Math.sqrt(s / (cant - 1));
        s = 100 * s / Math.abs(p);

        a = 1;
        //if (s <= desviacion){
            p = Math.abs(edadPromedio - p);
            if (p < difEdad)
                a = 10;
            else if (p > 1)
                a = 1;
            else {
                a = (p - difEdad) * 9 / (1 - difEdad);
                a = 10 - a;
            }
        //}
        ev.push(a);

        /*  AÑOS EN RAMA
            Promedio y desviación estandard*/
        p = 0;
        e = 0;
        for (i = 0; i < enRama.length; i++)
            p += (i + 1) * enRama[i];
        
        p = p / cant;
        
        for (i = 0; i < enRama.length; i++)
            e += enRama[i] * Math.pow( i + 1 - p, 2);
        
        e = Math.sqrt(e / (cant - 1));
        e = 100 * e / Math.abs(p);
        
        a = 1;
        //if (e <= deviation){
            e = Math.abs(tiempoPromedio - p);
            if (e < difTiempo)
                a = 10 - (e * 9 / difTiempo);            
        //}
        ev.push(a);
        
        /*  UNO TODOS LOS VALORES DE EVALUACIÓN EN UNO SOLO ENTRE 1 Y 10*/
        e = 0;
        a = 0;
        for (i = 0; i < ev.length; i++){
            a += importancia[i];
            e += importancia[i] * ev[i];
        }
        e = e / a;
        return e;
    };
   
    
    Evolucion.prototype.mejor = function(s, e){
        var adentro = [e, s],
            afuera,
            mover = false;
        
        for (var i = 0; i < this.cantMejores; i++){
            if (this.mejores[i].length === 0){
                this.mejores[i] = adentro;
                break;
            }
            
            
            if (mover || adentro[0] > this.mejores[i][0]){
                afuera = this.mejores[i];
                this.mejores[i] = adentro;
                adentro = afuera;
            }
        }
    };
    
    
    Evolucion.prototype.escribir = function(){
        var s = "";
        for (var i = 0; i < this.cantCampamentos; i++){
            if (this.campamentos[i] === undefined)
                continue;
            
            for (var q = 0; q < this.cantEquipos; q ++)
                s += this.campamentos[i][q] + " | ";
         
            //console.log(s);
            s += '\n';
        }
        console.log(s);
    };
    
    Evolucion.prototype.escribirMejores = function(){
        var s = '';
        
        for (var i = 0; i < this.cantMejores; i++){
            s += this.mejores[i][0] + "  ||  ";
            for (var q = 0; q < this.cantEquipos; q++)
                s += this.mejores[i][1][q] + " - " + this.equipos[q].nombre + " - " +  this.equipos[q].grupo + " | ";
            
            s += '\n';
        }
        
        console.log("-: MEJORES :-");
        console.log(s);
    };
    
    return Evolucion;
});