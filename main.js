var TermineLeer;


requirejs(['grupos/educando', 'grupos/educador', 'grupos/equipo', 'evolucion/evolucion', 'IO/read'], 
         function(Educando, Educador, Equipo, Evolucion, Read) {
    
    var read = new Read();
    read.readThis('data/Educandos.xlsx');
    
    
    TermineLeer = function(){
        var eqs = read.GimmieTheTeams('scouts');
        console.log(eqs.length);
    
        var evolucion = new Evolucion(100, 12, 4, eqs);
        //evolucion.start();
        
    };
    
});