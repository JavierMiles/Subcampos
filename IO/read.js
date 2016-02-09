//  GRUPO - RAMA- EQUIPO - NOMBRE - APELLIDO - V/M - EDAD - AÑOS EN LA RAMA
var cantDatos = 8;


define(['grupos/educando', 'grupos/educador', 'grupos/equipo', 'evolucion/evolucion'],
       function(Educando, Educador, Equipo, Evolucion){
    
    function Read(){
        this.req = new XMLHttpRequest();
        
        this.grupos = {};
    }
    
    Read.prototype.readThis = function(url){
        
        
        this.req.open('GET', url, true);
        this.req.responseType = 'arraybuffer';
        
        this.req.onload = this.onLoad.bind(this);

        this.req.send();
        
    };
    
    Read.prototype.onLoad = function(e){
        var arraybuffer = this.req.response;    
             
        var data = new Uint8Array(arraybuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; i++)
            arr[i] = String.fromCharCode(data[i]);

        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: 'binary'} );
        this.parseIt(workbook);
    };
    
    /* LISTA EDUCANDOS, LISTA EDUCADORES, LISTA DE GRUPOS*/
    Read.prototype.parseIt = function(workbook){
        var educandos = [],
            educadores = [];
        
        var cabecera = true, q = 0;
        
        var gente = [];
        
        var worksheet;
        
        for (var ws = 0; ws < workbook.SheetNames.length; ws++){
            worksheet = workbook.Sheets[workbook.SheetNames[ws]];
            
            for (var z in worksheet){
                if (z[0] === '!')
                    continue;

                if (cabecera){      /* No tengo en cuenta el nombre de los datos*/
                    q++;
                    if (q === cantDatos){
                        cabecera = false;
                        q = 0;
                    }
                    continue;
                }

                gente.push(worksheet[z].v);
                q++;

                if (q >= cantDatos){
                    q = 0;

                    var e = new Educando(gente[3].toLowerCase(),               // Nombre
                                         gente[4].toLowerCase(),               // Apellido
                                         parseInt(gente[6]),                   // Edad
                                         parseInt(gente[7]),                   // Años en la rama
                                         gente[5].toLowerCase(),               // Sexo
                                         gente[2].toLowerCase(),               // Equipo
                                         gente[1].toLowerCase(),               // Rama
                                         gente[0].toLowerCase());              // Grupo

                    educandos.push(e);

                    gente = [];
                }


            }
        }
        this.IWantItAll(educandos);
    };
    
    /*  SEPARA LOS DATOS EN GRUPOS/RAMA/EQUIPO  */
    Read.prototype.IWantItAll = function(educandos){
        var e;
        for (var i = 0; i < educandos.length; i++){
            e = educandos[i];
            if (!(e.grupo in this.grupos))
                this.grupos[e.grupo] = { lobatos:{}, scouts:{}, pioneros:{}, rover:{} };
            
            var r = this.grupos[e.grupo][e.rama];
            
            if (!(e.equipo in r))
                this.grupos[e.grupo][e.rama][e.equipo] = [];
            
            this.grupos[e.grupo][e.rama][e.equipo].push(e);
        }
        
        TermineLeer();
        
    };
    
    /*  DEVUELVE UNA LISTA CON TODOS LOS EQUIPOS    */
    Read.prototype.GimmieTheTeams = function(rama){
        var equipos = [], equipo;
        var r;
        for (var g in this.grupos){
            r = this.grupos[g][rama];
            for (var e in r){
                equipo = new Equipo(r[e], 'nadie', e, g, rama);
                equipos.push(equipo);
            }
        }
        
        return equipos;
    };
    
    return Read;
});

