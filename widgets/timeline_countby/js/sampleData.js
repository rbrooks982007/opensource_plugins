
TLSampleDataContainer =  function(){
	var keyToEntries = d3.map()
    ,keyset = []
	,timeEntries = []
    ,pageSize = 10;

    var collapseIntervals = function(values){

        var collisions = [];

        //Iterate incrementally over the intervals to check for a collision
        for(var i=0; i < values.length; i++){
            var entry  = values[i];

            //Iterate from the end of the array to find colliding intervals that will changed 
            for(var j = values.length-1; j > i; j--){
                var delta = values[j];
                //Check if interval is after or before the delta inteval
                if((entry.time.getTime() != delta.time.getTime()) 
                    && entry.value != delta.value){
                   continue;
                }
                
                //Merge the original interval into the delta interval; mark the original interval index for removal.
                collisions.push(i);
                break;
            }
        }
        
        //Remove all collisions from the entry's interval list
        for(var y=0; y < collisions.length; y++){
            var collision = collisions[y];
            for(var x = values.length; x >= 0; x--){
                 if(collision == x)
                    values.splice(x,1);
            }
        }
         
    }

    var randomNumber = function(min, max){
         return Math.floor(Math.random(0,1)*(max-min)) + min;    
    }

    var generateRandomWorkItems = function(){
        
        var entryCount = randomNumber(1, 10);

        for(var i=0; i < entryCount; i++){
             
            var  month = randomNumber(2, 3)
            ,day  = randomNumber(0,3)
            ,hour = randomNumber(0, 23)
            ,minutes = randomNumber(0, 59)
            ,seconds = randomNumber(0, 59);
     
            var start = new Date(2013, month, day, hour, minutes, seconds);
            var offsetHoursInMillis = randomNumber(0, 12) * 3600000;
            var offsetDayOfWeekInMillis = randomNumber(0, 1) * 86400000;
            var endInMillis = start.getTime() + offsetHoursInMillis + offsetDayOfWeekInMillis;
            var end = new Date(endInMillis);

            var stepDays = (endInMillis - start.getTime())/3600000 > 24;
            var times = stepDays ? d3.time.days(d3.time.day.floor(start), d3.time.day.ceil(end))
									: d3.time.hours(d3.time.hour.floor(start), d3.time.hour.ceil(end));
            var entries = [];
            var id = "value" + i;
            for(var t=0; t < times.length; t++){
                
                 //Set Time interval
                entries.push({id:id, time:times[t], value: randomNumber(0, 1000)});
            }
            keyToEntries.set(id, entries);
        }
    
    }

    generateRandomWorkItems();

    keyToEntries.forEach(function(key, values){
        collapseIntervals(values);
        for(var i=0; i < values.length; i++){
            var entry= values[i];
            timeEntries.push(entry.time);
        }             
    });
   

    return {
        keyToEntries: keyToEntries,
        keyset: keyToEntries.keys(),
        timeEntries: timeEntries,
        pageSize: pageSize
    }
}

