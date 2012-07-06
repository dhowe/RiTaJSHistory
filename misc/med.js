var MinEditDist =  (function() {

    min = function(a,b,c) {

        var min = a;
        if (b < min) min = b;
        if (c < min) min = c;
        return min;
    };

    getType = function(obj) { // DUP

        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };

    /*closest = function(candidates, target, result) {

        console.log("[WARN] Raw call to MinEditDist.closest()!!");

        var minVal = Number.MAX_VALUE;

        for (var i = 0; i <candidates.length; i++) {

            var candidate = candidates[i];
            var med = computeRaw(candidate, target);     
            if (med == 0) continue; // same word

            // we found something even closer
            if (med < minVal) {
                minVal = med;
                result = [];
                result.push(candidate);
            }  

            // we have another best to add
            else if (med == minVal)  
                result.push(candidate);
        }    

        return minVal;
    };*/

    /**
     * Computes min-edit-distance between 2 string arrays
     * where each array element either matches or does not
     */
    computeRawArray = function(srcArr, trgArr) {

        if (!srcArr.length && !trgArr.length) return 0;
        
        //console.log((srcArr)+" "+(trgArr));
        
        var matrix = []; // matrix
        var sI; // ith element of s
        var tJ; // jth element of t
        var cost; // cost

        // Step 1 ----------------------------------------------

        if (srcArr.length == 0) return trgArr.length;

        if (trgArr.length == 0) return srcArr.length;

        //matrix = new var[srcArr.length + 1][trgArr.length + 1];

        // Step 2 ----------------------------------------------

        for (var i = 0; i <= srcArr.length; i++) {
            matrix[i] = [];
            matrix[i][0] = i;
        }

        for (var j = 0; j <= trgArr.length; j++)    
            matrix[0][j] = j;

        // Step 3 ----------------------------------------------

        //String[] srcArr = RiFreeTTSEngine.cleanPhonemes(srcArr);    
        for (var i = 1; i <= srcArr.length; i++)
        {
            sI = srcArr[i - 1];

            // Step 4 --------------------------------------------

            for (var j = 1; j <= trgArr.length; j++)
            {
                tJ = trgArr[j - 1];

                // Step 5 ------------------------------------------

                cost = (sI === tJ) ? 0 : 1;

                // Step 6 ------------------------------------------
                matrix[i][j] = min (matrix[i - 1][j] + 1, 
                    matrix[i][j - 1] + 1, 
                    matrix[i - 1][j - 1] + cost);
            }
        }

        // Step 7 ----------------------------------------------

        return matrix[srcArr.length][trgArr.length];
    }

    /**
     * Minimum-Edit-Distance (or Levenshtein distance) is a measure of the similarity 
     * between two strings, the source string and the target string (t). The distance 
     * is the number of deletions, insertions, or substitutions required to transform 
     * the source into the target / avg_string_length<p> 
     * 
     * Adapted from Michael Gilleland's algorithm
     */
    var med = {

        /**
         * Compute min-edit-distance between 2 strings
         * @see MinEditDist#computeAdjusted(java.lang.String,java.lang.String)
         */ 
        computeRaw : function(source, target) { 

            var st = getType(source), tt = getType(source);
            
            if (st!=tt) throw Error('Unexpected args: '+source+"/"+target);

            if (tt==='array') return computeRawArray(source, target);
            
            if (!source.length && !target.length) return 0;

            var matrix = []; // matrix
            var sI; // ith character of s
            var tJ; // jth character of t
            var cost; // cost

            // Step 1 ----------------------------------------------
            var sourceLength = source.length;
            var targetLength = target.length;

            if (sourceLength == 0) return targetLength;

            if (targetLength == 0) return sourceLength;

            //matrix = new int[sourceLength + 1][targetLength + 1];

            // Step 2 ----------------------------------------------

            for (var i = 0; i <= sourceLength; i++) {
                matrix[i] = [];
                matrix[i][0] = i;
            }

            for (var j = 0; j <= targetLength; j++)   
                matrix[0][j] = j;

            // Step 3 ----------------------------------------------

            for (var i = 1; i <= sourceLength; i++)
            {

                sI = source.charAt(i - 1);

                // Step 4 --------------------------------------------

                for (var j = 1; j <= targetLength; j++)
                {
                    tJ = target.charAt(j - 1);

                    // Step 5 ------------------------------------------

                    cost = (sI == tJ) ? 0 : 1;

                    // Step 6 ------------------------------------------
                    matrix[i][j] = min(matrix[i - 1][j] + 1, 
                        matrix[i][j - 1] + 1, 
                        matrix[i - 1][j - 1] + cost);
                }
            }

            // Step 7 ----------------------------------------------

            return matrix[sourceLength][targetLength];
        },

        /**
         * Compute min-edit-distance between 2 strings (or 2 arrays of strings) 
         * divided by their average length.
         */ 
        computeAdjusted : function(source, target) {

            
            var st = getType(source), tt = getType(source);
            if (st===tt) {

                if (tt==='string') {
                    if (!source.length && !target.length) return 0;
                    //console.log(med.computeRaw(source, target)+'/'+(source.length + target.length));
                    return med.computeRaw(source, target) / (source.length + target.length);
                }
                else if (tt==='array') {
                    if (!source.length && !target.length) return 0;
                    //console.log(computeRawArray(source, target)+'/'+(source.length + target.length));
                    return computeRawArray(source, target) / (source.length + target.length);
                }
            }
            throw Error('Unexpected args: '+source+"/"+target);
        },
    }

    return med;

})();