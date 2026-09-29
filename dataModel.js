//model
//import Decimal from './node_modules/decimal.js/decimal.mjs';
//import Decimal from 'decimal.js/decimal.mjs';


/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

abacus class

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

export class abacus {


    convertToRegNum(arr){
        if (arr[0] == "0" && arr.length > 1){
            arr = arr.slice(1)
            return this.convertToRegNum(arr)
        }
        else{
            return arr
        }
    }

    prepareForSubt(arr,interimStates=[]){
        let state = []

        for(let i = 0; i < arr.length; i++){
            state.push(arr[i])
        }
        interimStates.push(state)
        let firstIdxNonZero = -1
        for(let i = 0; i < arr.length; i++){
            if(arr[i] != "0"){
                firstIdxNonZero = i
                break
            }

        }
        if(firstIdxNonZero < 0){
                return 
        }
        let firstIdx = -1

        for(let i = firstIdxNonZero+1; i < arr.length; i++){
            if(arr[i] == "0"){
                firstIdx = i
                break
            }
        }
        if(firstIdx < 0){
            return 
        }
         if(arr[firstIdx-1] == 'T'){            
            arr[firstIdx] = 'T'
            arr[firstIdx-1] = '9'
        }

        else{
            arr[firstIdx] = 'T'
            arr[firstIdx-1] = String(this.order[arr[firstIdx-1]]-1)
        }
            
        this.prepareForSubt(arr,interimStates)
    }
    convertToDec(arr,interimStates=[]){
        let state = []
        for(let i = 0; i < arr.length; i++){
            state.push(arr[i])
        }
        interimStates.push(state)
        for (let i = 0; i < arr.length; i++){
            if(arr[i] == "F"){
                arr[i] = '5'
            }
        }
        let firstIdx = -1
        for(let i = 1; i < arr.length; i++){
            if (arr[i] == 'T' && arr[i-1] != 'T'){
                firstIdx = i
                break
            }
                
        }
        if(firstIdx < 0){
            return
        }
        else if (this.order[arr[firstIdx-1]] == 9){
            arr[firstIdx - 1] = 'T'
            arr[firstIdx] = '0'
        }
        else{
            arr[firstIdx - 1] = String(this.order[arr[firstIdx-1]]+1)
            arr[firstIdx] = '0'
        }
        this.convertToDec(arr, interimStates)

    }



    constructor(numRods){
        this.backingList = [];
        this.numberOfRods = numRods;
        this.maxNum = ""
        this.order = {'0': 0,
             '1': 1,
             '2': 2,
             '3': 3,
             '4': 4,
             '5': 5,
             'F': 5,
             '6': 6,
             '7': 7,
             '8': 8,
             '9': 9,
             'T': 10}

        for(let i = 0; i < numRods; i++){
            this.backingList.push('0')
        }
        let mn = []
        for(let i = 0; i < numRods; i++){
            mn.push("T")
        }
        mn.unshift("0")
        this.convertToDec(mn)
        for( let i = 0; i < mn.length; i++){
            this.maxNum = this.maxNum + mn[i]
        }
            
    }


    set(num, idx = "NA"){
        if(idx == "NA"){
            idx = this.numberOfRods - num.length
        }
        else{
            idx = parseInt(idx,10)
        }
        
        if (num.length > this.numberOfRods){
            return
        }
        else if (num.length + idx > this.numberOfRods){
            return
        }
        else if(idx + num.length == this.numberOfRods){
            for(let i = 0; i < num.length; i++){
                this.backingList[idx+i] = num[i]
            }
        }
        else{
            for(let i = 0; i < num.length; i++){
                this.backingList[idx+i] = num[i]
            }
        }
        let state = []

        for (let i = 0; i < this.backingList.length; i++){
            state.push(this.backingList[i])
        }
        return [[state], state]
    }


    value(idx, numRods){
        if(idx + numRods > this.backingList.length){
            return
        }
        if((idx < 0) || numRods > this.backingList.length || numRods < 1){
            return
        }
        let startIdx = idx
        let endIdx = idx + numRods
        let printOut = ""
        let copy = []
        for(let i = startIdx; i < endIdx; i++){
            copy.push(this.backingList[i])
        }

        copy.unshift("0")
        this.convertToDec(copy)

        if(copy[0] == "0"){
            copy = copy.slice(1)
        }
        for(let i = 0; i < copy.length; i++){
            printOut = printOut + copy[i]
        }

        return [copy, printOut]
    }
    
    compare(idx, numRods, RHS){
        if(idx + numRods > this.backingList.length){
            return
        }
        if((idx < 0) || numRods > this.backingList.length || numRods < 1){
            return
        }
        let startIdx = idx 
        let endIdx = idx + numRods
        let RHSCopy = []
        let RHS1 = []
        for (let i = 0; i < RHS.length; i++){
            RHSCopy.push(RHS[i])
            RHS1.push(RHS[i])
        }
        let LHS = []
        let LHSCopy = []
        if(startIdx != endIdx){
            for(let i = startIdx; i < endIdx; i++ ){
                LHS.push(this.backingList[i])
                LHSCopy.push(this.backingList[i])
            }
        }
        else{
            LHS.push(this.backingList[startIdx])
            LHSCopy.push(this.backingList[startIdx])
        }
        let triple = [LHSCopy, " < ", RHSCopy]
        let maxLen = RHS.length

        if(LHS.length > RHS.length){
            maxLen = LHS.length
            for (let i = 0; i < maxLen-RHS.length; i++){
                RHS1.unshift("0")
                
            }
        }
        else{
            for(let i = 0; i < maxLen-LHS.length;i++){
                LHS.unshift("0")
            }
        }
        LHS.unshift("0")
        RHS1.unshift("0")
        this.convertToDec(LHS)
        this.convertToDec(RHS1)


        for(let i = 0; i < maxLen+1;i++){
            if(this.order[LHS[i]] > this.order[RHS1[i]]){
                triple[1] = " > "
                return triple
            }
            else if(this.order[LHS[i]] < this.order[RHS1[i]]){
                return triple
            }

        }

        triple[1] = " = "
        return triple


    }


    //this method is basically just used for testing
    //the user on the site doesn't get to use it
    clear(){
        for(let i = 0; i < this.numberOfRods; i++){
            this.set("0",i)
        }
    }

    codwtd(od,td){
        let firstDig = String(this.order[td[0]]) + "0"
        let secDig = String(this.order[td[1]])

        let twoDig = parseInt(firstDig,10) + parseInt(secDig)
        let oneDig = 0

        oneDig = this.order[od]
        let sum = twoDig+oneDig
        if (twoDig < oneDig){
            return 2
        }
        else if (sum > 110){
            return 1
        }
        else{
            return 0
        }
    }

    aodttd(od,td){
        let dub = [td[0],td[1]]
        if (td[0] == "F"){
            dub[0] = "5"
        }
        if (td[1] == "F"){
            dub[1] = "5"
        }
        td = dub
        let addend1 = 0
        let addend2 = 0

        if(td[1] == "T" && td[0] == "T"){
            addend1 = 110
        }
        else if (td[0] == "T"){
            addend1 = parseInt("10" + td[1])
        }
        else if (td[1] == "T"){
           addend1 = parseInt(String(parseInt(td[0],10) + 1) + '0',10)
        }
        else{
           addend1 = parseInt(td[0] + td[1],10)
        }
        addend2 = this.order[od]
            
        let sum = addend1+addend2
        let res = String(sum)

        if (res.length == 3 && res[1] != '1'){
            res = 'T' + res[2]
        }
        else if (res.length == 3 && res[1] == '1') {
            res = "TT"
        }
        else if(res.length == 1){
            res = "0" + res[0]

        }
        if(res[0] == '5' && td[0] == "4")
            res = "F" + res[1]
        return res
    }

    sodftd(od,td,specialRules=true){
        if (od == "0"){
            return td
        }
        let dub = [td[0],td[1]]
        let minuend = 0
        if (td[0] == "F"){
            dub[0] = "5"
        }
        if(td[1] == "F"){
            dub[1] = "5"
        }
        td = dub
        if(td[1] == "T" && td[0] == "T"){
            minuend = 110
        }
        else if (td[0] == "T"){
            minuend = parseInt("10" + td[1],10)
        }
        else if(td[1] == "T"){
            minuend = parseInt(String(parseInt(td[0],10) + 1) + "0",10)
        }
        else{
            minuend = parseInt(td[0] + td[1])
        }
        let subtrahend = this.order[od]

        let dif = minuend - subtrahend
        let res = String(dif)

        if(res.length == 3){
            if(res[2] == "5"){
                res = "T" + "F"
            }
            else{
                if (res[2] == "0"){
                    res = "9" + "T"
                }
                else{
                    res = "T" + res[2]
                }
            }
            
        }

        else if(res.length == 2 && res[1] == "0" && specialRules){
            res = String(parseInt(res[0],10)-1,10) + "T"

        }
        else if(res.length == 2 && res[1] == "5" && specialRules){
            res = String(parseInt(res[0],10)) + "F"
        }
        else if(res.length == 1){
            if (res == "5"){
                res = "0" + "F"
            }
            else{
                res = "0" + res
            }
            
        
        }
        return res

    }
    //just does a little check for valid input, it will be used once in subt.
    //idx will just be passed positive integers by subt
    canSubt(num, idx = "NA", start = 0){
        if (idx == "NA"){
            idx = this.numberOfRods - num.length
        }
        if (num.length > this.numberOfRods){
            return false
        }
        else if (num.length + parseInt(idx) > this.numberOfRods){
            return false
        }
        idx = parseInt(idx)
        if (start > idx){
            return false
        }
        let trip = this.compare(start,idx+num.length,num)

        if(trip[1] == " > " || trip[1] == " = "){
            return true
        }
        else{
            return false
        }
    }
    canMakeRoom(idx,endIdx=0){
        if (endIdx > idx){
            return false
        }
        if(idx + 1 > this.numberOfRods){
            return false
        }
        if (idx < 0){
            return false
        }
        let startIdx = idx

        let clearTill = -1
        let i = 0
        while(true){
            if(this.backingList[startIdx-i] != "T"){
                clearTill = startIdx - i
                break
            }
            i = i + 1
            if (i+endIdx > startIdx){
                break
            }    

        }
        if(clearTill < 0){
            return false
        }
        else{
            return true
        }
    }

    canTake(idx,endIdx=0){
        if(idx + 1 > this.numberOfRods){
            return
        }
        if(idx < 0){
            return
        }
        let startIdx = idx

        let clearTill = -1
        let i = 0

        while(true){

            if(this.backingList[startIdx-i] != "0"){
                clearTill = startIdx-i
                break
            }
            i = i + 1
            if (i+endIdx > startIdx){
                break
            }
        }
        if (clearTill < 0){
            return false
        }
        else{
            return true
        }
    }

    canClearForSubt(num, idx){
        let i = 0

        
        if (this.order[num[0]] == this.order[this.backingList[idx]]+1){
            i = idx+1

            while(i <= this.numberOfRods - 1){
                if(this.backingList[i] == "T"){
                    return [true, i]
                }
                else if (this.backingList[i] == "9"){
                    i = i + 1

                    continue
                }
                else{
                    return [false, i]
                }
            }
            return [false,i]
        }
        else {
            return [false,i]
        }

    }

    canFillForAdd(num,idx){
        let i = 0

        if(this.order[num[0]] + this.order[this.backingList[idx]] == 11){
            i = idx+1
            while(i <= this.numberOfRods - 1){
                if(this.backingList[i] == "0"){
                    return [true, i]
                }
                else if(this.backingList[i] == "1"){
                    i = i + 1
                    continue
                }
                else{
                    return [false, i]
                }
            }
            return [false,i]
        }
        else{
            return [false,i]
        }
    }

    clearRods(idx, interimStates=[],provideInterimStates=false){
        if(idx + 2 > this.numberOfRods){
            return
        }
        if(idx < 0 || idx > this.numberOfRods - 2){
            return
        }
        let startIdx = idx //left rod
        let endIdx = idx + 2

        let clearTill = -1
        let i = 0
        let j = 0

        while(true){
            if(this.backingList[startIdx-i] != "T"){
                if (this.backingList[startIdx-i] == "9"){
                    if(startIdx - i != 0 && this.canMakeRoom(startIdx-i)){
                        i = i + 1
                        continue
                    }
                    else{
                        clearTill = startIdx - i
                        break
                    }

                }
                else{
                    clearTill = startIdx - i
                    break
                }
            }
            i = i + 1
            if(i > startIdx){
                clearTill = 0
                break
            }
        }
        startIdx = clearTill
        let list = []

        for (let i = startIdx; i < endIdx; i++){
            list.push(this.backingList[i])
        }
        this.convertToDec(list, interimStates)
        let iS = []
        let copyOfBackingList = []

        for(let k = 0; k < interimStates.length; k++){
            copyOfBackingList = []

            for(let c = 0; c < this.backingList.length; c++){
                copyOfBackingList.push(this.backingList[c])
            }
            j = 0

            for(let i = startIdx; i < endIdx; i++ ){
                copyOfBackingList[i] = interimStates[k][j]
                j = j + 1
            }
            iS.push(copyOfBackingList)

        }
        j = 0
        for(let i = startIdx; i < endIdx; i++){
            this.backingList[i] = list[j]
            j = j + 1
        }
        if(provideInterimStates){
            return iS
        }
        else{
            let li = []
            for (let c = 0; c < this.backingList.length; c++){
                li.push(this.backingList[c])
            }
            return[li]
        }

    }
    fillRods(idx, interimStates = [], provideInterimStates=false){
        if (idx + 2 > this.numberOfRods){
            return
        }
        if(idx < 0 || idx > this.numberOfRods-2){
            return
        }
        let startIdx = idx
        let endIdx = idx + 2

        let clearTill = -1
        let i = 0 
        let j = 0
        let copyOfBackingList = []

        while(true){                                                                                
            if(this.backingList[startIdx-i] != "0"){
                if(this.backingList[startIdx-i] == "1"){
                    if(startIdx-i != 0 && this.canTake(startIdx-i)){
                        i = i + 1
                        continue
                    }
                    else{
                        clearTill = startIdx-i
                        break
                    }
                }
                else{
                    clearTill = startIdx-i
                    break
                }
            }
            i = i + 1
            if (i > startIdx){
                clearTill = 0
                break
            }
        }

        if(clearTill > -1){
            startIdx = clearTill
        }
        let list = []

        for(let i = startIdx; i < endIdx; i++){
            list.push(this.backingList[i])
        }
        this.prepareForSubt(list,interimStates)
        let iS = []

        for(let k = 0; k < interimStates.length; k++){
            copyOfBackingList = []

            for (let c = 0; c < this.backingList.length; c++){
                copyOfBackingList.push(this.backingList[c])
            }
            j = 0

            for(let i = startIdx; i < endIdx; i++){
                copyOfBackingList[i] = interimStates[k][j]
                j = j + 1
            }
            iS.push(copyOfBackingList)
        }
        j = 0
        for(let i = startIdx; i < endIdx; i++){
            this.backingList[i] = list[j]
            j = j + 1
        }
        if(provideInterimStates){
            return iS
        }
        else{
            let li = []
            for (let c = 0; c < this.backingList.length; c++){
                li.push(this.backingList[c])

            }
            return [li]
        }

    }
    
    canIAddThis(num,idx,turnOffClearRods=false){
        let dummy = new abacus(this.numberOfRods+1)

        if(num.length > this.numberOfRods){
            return false
        }
        else if (num.length + idx > this.numberOfRods){
            return false
        }
        for(let i = 1; i < this.backingList.length + 1; i++){
            dummy.set(this.backingList[i-1],i)
        }
        

        let dindex = idx + 1
        for(let i = 0; i < num.length; i++){

           if(!(dummy.canMakeRoom(dindex+i-1,i)) && (dummy.order[dummy.backingList[dindex+i]]+dummy.order[num[i]] > 11)){
                return false
            }

            let double = [dummy.backingList[dindex + i -1] + dummy.backingList[dindex + i],num[i]]
            let comp = this.codwtd(double[1],double[0])
            if (comp == 1){
                let secondCheck = dummy.canMakeRoom(idx+i)
                if(!secondCheck){
                    return false
                }
                if(!turnOffClearRods){
                    dummy.clearRods(idx+i,[],true)
                    double = (dummy.backingList[dindex + i -1] + dummy.backingList[dindex + i],num[i])
                }
            }
            let res = dummy.aodttd(double[1], double[0])
            dummy.set(res[0],dindex + i -1)
            dummy.set(res[1],i+dindex)

        }
        if (dummy.compare(0,this.numberOfRods+1,this.maxNum)[1] == " > "){
            return false
        }
        else{
            return true
        }

    }

    add (num, idx="NA",redundantSteps=true,turnOffClearRods=false){
        /*console.log(idx)
        if(idx){
            
        }
        else{
            idx = "NA"
        }*/
        
        let states = []
        if(idx == "NA"){
            idx = this.backingList.length - num.length
        }
        else{
            idx = parseInt(idx,10)
        }

        if(idx < 0){
            console.log("error!")
            return states
        }
        else if(num.length > this.numberOfRods){
            console.log("error!")
            return states
        }
        else if(num.length + idx > this.numberOfRods){
            console.log("error!")
            return states
        }

        if(!this.canIAddThis(num,idx)){
            console.log("error!")
            return states
        }

        let adi = this.canFillForAdd(num,idx)

        if((adi[0]) && !(this.canMakeRoom(idx-1))){
            //states.concat(this.fillRods(adi[1]-1,[],true))
            states = [...states,...this.fillRods(adi[1]-1,[],true)]
        }

        let double = []
        for(let i = 0; i < num.length; i++){
            if(idx + i == 0){
                double = ["T" + this.backingList[idx+i],num[0]]
            }
            else{
                double = [this.backingList[idx + i - 1] + this.backingList[idx + i],num[i]]
            }
            if(double[1] == '0' && !(redundantSteps)){
                continue
            }
            let comp = this.codwtd(double[1],double[0])

            if(comp == 1){
                let secondCheck = this.canMakeRoom(idx+i)
                if(!secondCheck){
                    console.log("error!")
                    return states
                }
                if(!turnOffClearRods && idx+i != 1){
                    //states.concat(this.clearRods(idx+i-1,[],true))
                    states = [...states, ...this.clearRods(idx+i-1,[],true)]
                }
                if(idx + i - 1 < 0){
                    double = ["T" + this.backingList[idx+i],num[i]]
                }
                else{
                    double = [this.backingList[idx + i - 1] + this.backingList[idx+i],num[i]]
                }
            }
            
            let res = this.aodttd(double[1],double[0])
            if(idx+i==0){
                this.backingList[i+idx] = res[1]
            }
            else{
                this.backingList[idx + i - 1] = res[0]
                this.backingList[i+idx] = res[1]
            }
            let lis = []
            for (let c = 0; c < this.backingList.length; c++){
                lis.push(this.backingList[c])
            }
            states.push(lis)

        }
        return states

        
    }
    subt(num,idx = "NA", redundantSteps = true,turnOffFillRods=false,turnOffClearRods=false){
        let states = []

        if(idx == "NA"){
            idx = this.backingList.length - num.length
        }
        else{
            idx = parseInt(idx,10)
        }

        if(idx < 0){
            console.log("error 0")
            return states
        }
        else if (num.length > this.numberOfRods){
            console.log("error 1")
            return states
        }
        else if (num.length + idx > this.numberOfRods){
            console.log("error 2")
            return states
        }
        else{
            if(!this.canSubt(num,idx)){
               const firstCheck = this.canClearForSubt(num[num.length-1],idx+num.length-1)
                if (!firstCheck[0]){
                    console.log("error 3")
                    return states
                }
            }
        }
        let i = 0
        let lenny = num.length
        let comp = 0
        let secondCheck = [false,0]
        let res = ""
        let lis = []


        while(i < lenny){
            let double = []
            if(idx+i == 0){
                double = ["0" + this.backingList[idx+i],num[0]]
            }
            else{
                double = [this.backingList[idx + i - 1] + this.backingList[idx + i],num[i]]
            }
            if(double[1] == "0" && !redundantSteps){
                i = i + 1
                continue
            }
            comp = this.codwtd(double[1],double[0])
            secondCheck = this.canClearForSubt(double[1],idx+i)

            if(comp == 2){
                if(secondCheck[0] && !turnOffClearRods){
                    
                    states = [...states, ...this.clearRods(secondCheck[1]-1,[],true)]

                }
                if (!turnOffFillRods && !secondCheck[0]){

                    if(this.canTake(idx+i) && idx+i != 1){
                        
                        states = [...states, ...this.fillRods(idx+i-1,[],true)]
                    }
                   
                }
                if(idx+i-1<0){
                    double = ["0" + this.backingList[idx+i],num[i]]
                }
                else{
                    double = [this.backingList[idx + i - 1] + this.backingList[idx + i],num[i]]
                }
                if(double[1] == "0" && !redundantSteps){
                    i = i + 1
                    continue
                }

            }
            res = this.sodftd(double[1], double[0])

            if(idx+i == 0){
                this.backingList[i+idx] = res[1]
            }
            else{
                this.backingList[idx+i-1] = res[0]
                this.backingList[i+idx] = res[1]
            }
            lis = []
            for(let c = 0; c < this.backingList.length; c++){
                lis.push(this.backingList[c])
            }
            states.push(lis)
            i = i+1


        }
        return states
       
    }

}

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

general stuff

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

export let unitRod = 0

export function convertToRegNum(st){
    let arr = []
    for(const c of st){
        arr.push(c)
    }

    if(arr[0] == "0" && arr.length > 1){
        arr.shift()
        return convertToRegNum(arr)
    }
    else{
        return arr
    }
}

function reverse(arr){
    let revs = []

    for(let i = 0; i < arr.length; i++){
        revs.push(arr[arr.length-1-i])
    }
    return revs
}

export function stringize(arr){
    let res = ""

    for(const c of arr){
        res = res + c
    }
    return res
}

export function countLeading0sSubn(inp){
    let count = 0
    for(const c of inp){
        if(c=="0"){
            count = count + 1
        }
        else{
            break
    
        }
    }
    if(count == inp.length){
        return 0
    }
    else{
        return count
    }

}


export function removeLeading0s(inp){
    let ret = ""
    let scopei = 0
    for(let i = 0; i< inp.length; i++){
        if(inp[i] == "0"){
            continue
        }
        else{
            scopei = i
            break
        }
    }
    for (let j = scopei; j < inp.length; j++){
        ret = ret + inp[j]
    }
    return ret
}


export function prepend0s(inp,n){
    //do I need to put in code making sure n is never negative
    //that's what the ai did with the subnumber code in binaryAddAndSubt.js
    let m = Math.max(0,n)
    let strin = ""
    strin = "0".repeat(m)
    strin = strin + inp
    return strin
}

export function sn(input){
    let strin = []
    let subnumbers = []
    
    let count = countLeading0sSubn(input)
    input = removeLeading0s(input)

    for(let i = 0; i < input.length; i++){
        for(let c = i; c < input.length;c++){
            strin = strin + " " + input[c]
        }
        subnumbers.push(" ".repeat(count*2) + strin)
        strin = ""
    }
    if(input.length == 1){
        subnumbers.push(" ")
    }
    else{
        subnumbers.push(" ".repeat(input.length-1))
    }
    return subnumbers
}


export function produceProperSubnum(list,wantedSize){
    let offset = wantedSize - list.length
    let newLis = []

    for(let i = 0; i < wantedSize; i++){
        if(i >= offset){
            newLis.push(list[i-offset])
        }
        else{
            newLis.push(list[0])
        }
    }
    return newLis
}


const nB = [[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
      [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]],
      [[0,0],[0,2],[0,4],[0,6],[0,8],[1,0],[1,2],[1,4],[1,6],[1,8]],
      [[0,0],[0,3],[0,6],[0,9],[1,2],[1,5],[1,8],[2,1],[2,4],[2,7]],
      [[0,0],[0,4],[0,8],[1,2],[1,6],[2,0],[2,4],[2,8],[3,2],[3,6]],
      [[0,0],[0,5],[1,0],[1,5],[2,0],[2,5],[3,0],[3,5],[4,0],[4,5]],
      [[0,0],[0,6],[1,2],[1,8],[2,4],[3,0],[3,6],[4,2],[4,8],[5,4]],
      [[0,0],[0,7],[1,4],[2,1],[2,8],[3,5],[4,2],[4,9],[5,6],[6,3]],
      [[0,0],[0,8],[1,6],[2,4],[3,2],[4,0],[4,8],[5,6],[6,4],[7,2]],
      [[0,0],[0,9],[1,8],[2,7],[3,6],[4,5],[5,4],[6,3],[7,2],[8,1]]]

function listize(st){
    let l = []
    for(const c of st){
        l.push(c)
    }
    return l
}

export function checkTD(inp){

    if(inp.length < 1){
        return false
    }
    if(inp[0] == "-"){
        return checkTD(inp.slice(1))
    }
    let decimalPointFoundFlag = false
    if(inp.length == 1){
        if (inp.charCodeAt(0) < 48 || inp.charCodeAt(0) > 57){
            return false
        }
    }
    for(let i = 0; i < inp.length; i++){
        if(inp.charCodeAt(i) == 46){
            if(decimalPointFoundFlag){
                return false
            }
            if(i == inp.length-1 || i == 0){
                return false
            }
            decimalPointFoundFlag = true
        }
    }
    if(inp.charCodeAt(0) == 48 && inp.charCodeAt(1) != 46 && inp.length > 1){
        return false
    }
    for (const c of inp){
        if((c.charCodeAt(0) < 48 || c.charCodeAt(0) > 57) && !decimalPointFoundFlag){
            return false
        }
    }
    if(inp.charCodeAt(inp.length-1) == 48 && decimalPointFoundFlag){
        return false
    }
    return true
}

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

ascii conversion 

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

const dictReg = {
        '0': "=O|=||OOOOO=",
        '1': "=O|=O||OOOO=",
        '2': "=O|=OO||OOO=",
        '3': "=O|=OOO||OO=",
        '4': "=O|=OOOO||O=",
        'F': "=O|=OOOOO||=",
        '5': "=|O=||OOOOO=",
        '6': "=|O=O||OOOO=",
        '7': "=|O=OO||OOO=",
        '8': "=|O=OOO||OO=",
        '9': "=|O=OOOO||O=",
        'T': "=|O=OOOOO||=",
        "=O|=||OOOOO=": '0',
        "=O|=O||OOOO=": '1',
        "=O|=OO||OOO=": '2',
        "=O|=OOO||OO=": '3',
        "=O|=OOOO||O=": '4',
        "=O|=OOOOO||=": 'F',
        "=|O=||OOOOO=": '5',
        "=|O=O||OOOO=": '6',
        "=|O=OO||OOO=": '7',
        "=|O=OOO||OO=": '8',
        "=|O=OOOO||O=": '9',
        "=|O=OOOOO||=": 'T'} 


export function display(arr){


        let compact = []
        let rows = ["","","","","","","","","","","","","","",""]
        let total = ""

        if(arr.length > 0){
            for(let i = 0; i < arr.length; i++){
                compact.push(dictReg[arr[i]])
            }

        }
        
        for(let j = 0; j < 12; j++){
            for(let k = 0; k < compact.length; k++){
                rows[j] = rows[j] + compact[k][j]
                if (j == 0 || j == 3 || j == 11){
                        rows[j] = rows[j] + "="

                }
                
                else if (k < compact.length-1){
                    rows[j] = rows[j] + " "
                }
                    

            }
        }

        for (let i = 0; i < 12; i++){
            total = total + rows[i] + "\n"
        }

        return total
            

}


export function flipBook(arrs){
    let states = []

    for(let c = 0; c < arrs.length; c++){
        if (arrs[c][0] == "$"){
            continue
        }
        if (arrs[c][0] == "%"){
            states.push(arrs[c])
            continue
        }
        states.push(display(arrs[c]))
    }

    return states
}

const dictBin = {'0': "=O|=",
              '1': "=|O="}

export function displayBin(list){
    let compact = []
    let rows = ["","","",""]
    let total = ""

    if(list.length > 0){
        for (const c of list){
            compact.push(dictBin[c])
        }
    }
    for (let j = 0; j < 4; j++){
        for (let k = 0; k < compact.length;k++){
            rows[j] = rows[j] + compact[k][j]
            if(j==0 || j==3){
                rows[j] = rows[j] + "="
            }
            else if(k < compact.length-1){
                rows[j] = rows[j] + " "
            }
        }
    }
    for(let i = 0; i < 4; i++){
        total = total + rows[i] + "\n"
    }

    return total
}

export function flipBookBin(list){
    let states = []

    for(const c of list){
        if(c[0] == "$"){
            continue
        }
        states.push(displayBin(c))
    }

    return states
}

const pairT =   "_                 _" + "\n" + "_/ \\_             _/ \\_" + "\n" + "_/ | | \\           / | | \\_" + "\n" + "/ | | | |           | | | | \\" + "\n" + "| | | | |           | | | | |" + "\n" + "| | | | |           | | | | |" + "\n" + "| | | | |   _   _   | | | | |" + "\n" + "| |     |  / / \\ \\  |     | |" + "\n" + "|       | / /   \\ \\ |       |" + "\n" + "|       |/ /     \\ \\|       |" + "\n" + "|         /       \\         |" + "\n" + "|        /         \\        |" + "\n" + "\\      .'          '.      /" + "\n" + " |     |            |     | "
const pair9 = "_                 _" + "\n" + "_/ \\_             _/ \\_" + "\n" + "_/ | | \\           / | | \\_" + "\n" + "/ | | | |           | | | | \\" + "\n" + "| | | | |           | | | | |" + "\n" + "| | | | |           | | | | |" + "\n" + "| | | | |   _       | | | | |" + "\n" + "| |     |  / /     ||     | |" + "\n" + "|       | / /      ||       |" + "\n" + "|       |/ /       ||       |" + "\n" + "|         /        ||       |" + "\n" + "|        /         ||       |" + "\n" + "\\      .'          '.      /" + "\n" + " |     |            |     | "
const pair8 = "_                 _" + "\n" + "_/ \\_              / \\_" + "\n" + "_/ | | \\             | | \\_" + "\n" + "/ | | | |             | | | \\" + "\n" + "| | | | |             | | | |" + "\n" + "| | | | |             | | | |" + "\n" + "| | | | |   _        _| | | |" + "\n" + "| |     |  / /     ||     | |" + "\n" + "|       | / /      ||       |" + "\n" + "|       |/ /       ||       |" + "\n" + "|         /        ||       |" + "\n" + "|        /         ||       |" + "\n" + "\\      .'          '.      /" + "\n" + " |     |            |     | "
const pair7 = "_                  " + "\n" + "_/ \\_                 _" + "\n" + "_/ | | \\               | \\_" + "\n" + "/ | | | |               | | \\" + "\n" + "| | | | |               | | |" + "\n" + "| | | | |               | | |" + "\n" + "| | | | |   _        _ _| | |" + "\n" + "| |     |  / /     ||     | |" + "\n" + "|       | / /      ||       |" + "\n" + "|       |/ /       ||       |" + "\n" + "|         /        ||       |" + "\n" + "|        /         ||       |" + "\n" + "\\      .'          '.      /" + "\n" + " |     |            |     | "
const pair6 = "_                  " + "\n" + "_/ \\_                  " + "\n" + "_/ | | \\                  _" + "\n" + "/ | | | |                 | \\" + "\n" + "| | | | |                 | |" + "\n" + "| | | | |                 | |" + "\n" + "| | | | |   _        _ _ _| |" + "\n" + "| |     |  / /     ||     | |" + "\n" + "|       | / /      ||       |" + "\n" + "|       |/ /       ||       |" + "\n" + "|         /        ||       |" + "\n" + "|        /         ||       |" + "\n" + "\\      .'          '.      /" + "\n" + " |     |            |     | "
const pair5 = "_                  " + "\n" + "_/ \\_                  " + "\n" + "_/ | | \\                   " + "\n" + "/ | | | |                    " + "\n" + "| | | | |                    " + "\n" + "| | | | |                    " + "\n" + "| | | | |   _        _ _ _   " + "\n" + "| |     |  / /     ||      _ " + "\n" + "|       | / /      ||       |" + "\n" + "|       |/ /       ||       |" + "\n" + "|         /        ||       |" + "\n" + "|        /         ||       |" + "\n" + "\\      .'          '.      /" + "\n" + " |     |            |     | "
//const pair0 = "                        " + "\n" + "                          " + "\n" + "                            " + "\n" + "                             " + "\n" + "                             " + "\n" + "                             " + "\n" + "   _ _ _              _ _ _   " + "\n" + "  _     ||         ||      _ " + "\n" + "|       ||         ||       |" + "\n" + "|       ||         ||       |" + "\n" + "|       ||         ||       |" + "\n" + "|       ||         ||       |" + "\n" + " \\      .'         '.      /" + "\n" + "  |     |           |     | "
/*let pair1 = "                        " + "\n" + "                          " + "\n" + "                            _ " + "\n" + "                           | \\" + "\n" + "                           | |" + "\n" + "                           | |" + "\n" + "   _ _ _              _ _ _| |" + "\n" + "  _     ||         ||      | |" + "\n" + "|       ||         ||        |" + "\n" + "|       ||         ||        |" + "\n" + "|       ||         ||        |" + "\n" + "|       ||         ||        |" + "\n" + " \\      .'         '.       /" + "\n" + "  |     |           |     | "
let pair2 = "                        " + "\n" + "                        _ " + "\n" + "                         | \\_ " + "\n" + "                         | | \\" + "\n" + "                         | | |" + "\n" + "                         | | |" + "\n" + "   _ _ _              _ _| | |" + "\n" + "  _     ||         ||      | |" + "\n" + "|       ||         ||        |" + "\n" + "|       ||         ||        |" + "\n" + "|       ||         ||        |" + "\n" + "|       ||         ||        |" + "\n" + " \\      .'         '.       /" + "\n" + "  |     |           |     | "
let pair3 = "                   _" + "\n" + "                    / \\_" + "\n" + "                       | | \\_ " + "\n" + "                       | | | \\" + "\n" + "                       | | | |" + "\n" + "                       | | | |" + "\n" + "   _ _ _              _| | | |" + "\n" + "  _     ||         ||      | |" + "\n" + "|       ||         ||        |" + "\n" + "|       ||         ||        |" + "\n" + "|       ||         ||        |" + "\n" + "|       ||         ||        |" + "\n" + " \\      .'         '.       /" + "\n" + "  |     |           |     | "
let pair4 = "                   _" + "\n" + "                   _/ \\_" + "\n" + "                     / | | \\_ " + "\n" + "                     | | | | \\" + "\n" + "                     | | | | |" + "\n" + "                     | | | | |" + "\n" + "   _ _ _             | | | | |" + "\n" + "  _     ||         ||      | |" + "\n" + "|       ||         ||        |" + "\n" + "|       ||         ||        |" + "\n" + "|       ||         ||        |" + "\n" + "|       ||         ||        |" + "\n" + " \\      .'         '.       /" + "\n" + "  |     |           |     | "*/
const pairF = "                   _" + "\n" + "                   _/ \\_" + "\n" + "                    / | | \\_" + "\n" + "                     | | | | \\" + "\n" + "                     | | | | |" + "\n" + "                     | | | | |" + "\n" + "   _ _ _         _   | | | | |" + "\n" + "  _     ||      \\ \\  |     | |" + "\n" + "|       ||       \\ \\ |       |" + "\n" + "|       ||        \\ \\|       |" + "\n" + "|       ||         \\         |" + "\n" + "|       ||          \\        |" + "\n" + " \\      .'          '.      /" + "\n" + "  |     |            |     | "


let row1 = "                        "
let row2 = "                          "
let row3 = "                           _ "
let row4 = "                          | \\"
let row5 = "                          | |"
let row6 = "                          | |"
let row7 = "   _ _ _             _ _ _| |"
let row8 = "  _     ||         ||     | |"
let row9 = "|       ||         ||       |"
let row10 = "|       ||         ||       |"
let row11 = "|       ||         ||       |"
let row12 = "|       ||         ||       |"
let row13 = " \\      .'         '.      /"
let row14 = "  |     |           |     | "

const pair1 = row1 + "\n" + row2 + "\n" + row3 + "\n" + row4 + "\n" + row5 + "\n" + row6 + "\n" + row7 + "\n" + row8 + "\n" + row9 + "\n" + row10 + "\n" + row11 + "\n" + row12 + "\n" + row13 + "\n" + row14

row1 = "                        "
row2 = "                       _ "
row3 = "                        | \\_ "
row4 = "                        | | \\"
row5 = "                        | | |"
row6 = "                        | | |"
row7 = "   _ _ _             _ _| | |"
row8 = "  _     ||         ||     | |"
row9 = "|       ||         ||       |"
row10 = "|       ||         ||       |"
row11 = "|       ||         ||       |"
row12 = "|       ||         ||       |"
row13 = " \\      .'         '.      /"
row14 = "  |     |           |     | "

const pair2 = row1 + "\n" + row2 + "\n" + row3 + "\n" + row4 + "\n" + row5 + "\n" + row6 + "\n" + row7 + "\n" + row8 + "\n" + row9 + "\n" + row10 + "\n" + row11 + "\n" + row12 + "\n" + row13 + "\n" + row14

row1 = "                  _"
row2 = "                   / \\_"
row3 = "                      | | \\_ "
row4 = "                      | | | \\"
row5 = "                      | | | |"
row6 = "                      | | | |"
row7 = "   _ _ _             _| | | |"
row8 = "  _     ||         ||     | |"
row9 = "|       ||         ||       |"
row10 = "|       ||         ||       |"
row11 = "|       ||         ||       |"
row12 = "|       ||         ||       |"
row13 = " \\      .'         '.      /"
row14 = "  |     |           |     | "

const pair3 = row1 + "\n" + row2 + "\n" + row3 + "\n" + row4 + "\n" + row5 + "\n" + row6 + "\n" + row7 + "\n" + row8 + "\n" + row9 + "\n" + row10 + "\n" + row11 + "\n" + row12 + "\n" + row13 + "\n" + row14

row1 = "                  _"
row2 = "                  _/ \\_"
row3 = "                    / | | \\_ "
row4 = "                    | | | | \\"
row5 = "                    | | | | |"
row6 = "                    | | | | |"
row7 = "   _ _ _            | | | | |"
row8 = "  _     ||         ||     | |"
row9 = "|       ||         ||       |"
row10 = "|       ||         ||       |"
row11 = "|       ||         ||       |"
row12 = "|       ||         ||       |"
row13 = " \\      .'         '.      /"
row14 = "  |     |           |     | "

const pair4 = row1 + "\n" + row2 + "\n" + row3 + "\n" + row4 + "\n" + row5 + "\n" + row6 + "\n" + row7 + "\n" + row8 + "\n" + row9 + "\n" + row10 + "\n" + row11 + "\n" + row12 + "\n" + row13 + "\n" + row14

row1 = "                        "
row2 = "                          "
row3 = "                            "
row4 = "                             "
row5 = "                             "
row6 = "                             "
row7 = "   _ _ _             _ _ _   "
row8 = "  _     ||         ||      _ "
row9 = "|       ||         ||       |"
row10 = "|       ||         ||       |"
row11 = "|       ||         ||       |"
row12 = "|       ||         ||       |"
row13 = " \\      .'         '.      /"
row14 = "  |     |           |     | "

const pair0 = row1 + "\n" + row2 + "\n" + row3 + "\n" + row4 + "\n" + row5 + "\n" + row6 + "\n" + row7 + "\n" + row8 + "\n" + row9 + "\n" + row10 + "\n" + row11 + "\n" + row12 + "\n" + row13 + "\n" + row14

const obj = {"0": pair0,"1": pair1,"2": pair2, "3": pair3, "4": pair4, "5": pair5, "6": pair6, "7": pair7, "8": pair8, "9": pair9, "F": pairF, "T": pairT}
export function handFlip(listOfLists){
    let hout = []

    for(const l1 of listOfLists){
            let out = ""
            for(const l2 of l1){
                out = out + obj[l2] + "\n"
            }
            hout.push(out)

    }
    return hout
}


/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

integer stuff

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

const mT = [["00","00","00","00","00","00","00","00","00","00"],
          ["00","01","02","03","04","05","06","07","08","09"],
          ["00","02","04","06","08","10","12","14","16","18"],
          ["00","03","06","09","12","15","18","21","24","27"],
          ["00","04","08","12","16","20","24","28","32","36"],
          ["00","05","10","15","20","25","30","35","40","45"],
          ["00","06","12","18","24","30","36","42","48","54"],
          ["00","07","14","21","28","35","42","49","56","63"],
          ["00","08","16","24","32","40","48","56","64","72"],
          ["00","09","18","27","36","45","54","63","72","81"]]

const order  = {'0': 0,
             '1': 1,
             '2': 2,
             '3': 3,
             '4': 4,
             '5': 5,
             'F': 5,
             '6': 6,
             '7': 7,
             '8': 8,
             '9': 9,
             'T': 10}

export function minus(minuend,subtrahend){
    let minu = minuend.length
    let sutr = subtrahend.length

    let ext = Math.max(8,Math.max(minu,sutr)) + 1

    let tray = new abacus(ext)

    tray.set(minuend)

    const trip = tray.compare(0,ext,subtrahend)

    let greater = ""
    let lesser = ""
    let res = []

    if(trip[1] == " < "){
        tray.clear()
        greater = subtrahend
        lesser = minuend
        //res = res + ["-"] same as res = ["-"] + res
        res = ["-"]
    }
    else{
        greater = minuend
        lesser = subtrahend
    }
    let states = []
    let lis = []
    tray.set(greater)
    for (const c of tray.backingList){
        lis.push(c)
    }
    states.push(lis)
    states = [...states, ...tray.subt(lesser)]


    res = [...res,...convertToRegNum(tray.value(0,tray.numberOfRods)[0])]
    return [states,stringize(res)]
}
export function regAdd(addend1, addend2){
    const testSize = Math.max(8,Math.max(addend1.length, addend2.length)) + 1
    let test = new abacus(testSize)

    test.set(addend1)
    test.add(addend2)

    const displaySize = Math.max(8,Math.max(addend1.length,addend2.length))

    let display = new abacus(displaySize)

    if(test.compare(0,testSize,display.maxNum)[1] == " > "){
        displaySize = displaySize + 1

        display = null;

        display = new abacus(displaySize)


    }

    test = null;

    display.set(addend1)

    let states = []
    let lis = []

    for (const c of display.backingList){
        lis.push(c)
    }
    states.push(lis)
    states = [...states,...display.add(addend2)]

    return [states, stringize(convertToRegNum(display.value(0,displaySize)[1]))]
}
export function adiro(addend1, addend2, randomRods){
    const displaySize = Math.max(8,Math.max(addend1.length,addend2.length)) + 1

    let display = new abacus(displaySize)

    display.set(addend1)


    let states = []
    let lis = []
    for(const c of display.backingList){
        lis.push(c)
    }
    states.push(lis)

    let iS = []

    for(const c of randomRods){
        let off = displaySize - addend2.length
        states = [...states,...display.add(addend2[c],off+c,true,false)]
    }

    return [states, stringize(convertToRegNum(display.value(0,displaySize)[1]))]

}

export function sudiro(minuend, subtrahend, randomRods){
    const displaySize = Math.max(8,Math.max(minuend.length,subtrahend.length)) + 1

    let display = new abacus(displaySize)

    display.set(minuend)

    let states = []
    let lis = []

    for(const c of display.backingList){
        lis.push(c)
    }
    states.push(lis)

    if(display.compare(0,displaySize,subtrahend)[1] == " < "){
        return states
    }

    let iS = []
    for(const c of randomRods){
        let off = displaySize - subtrahend.length
        states = [...states,...display.subt(subtrahend[c],off+c)]
    }

    return [states,stringize(convertToRegNum(display.value(0,displaySize)[1]))]
}
export function prepForModMultJPS(plier, plicand, getRidOfLeading0s=true,sp=0){
    let multiplierIndices = []
    let multiplicandIndices = []

    if(getRidOfLeading0s){
        plier = stringize(convertToRegNum(plier))
        plicand = stringize(convertToRegNum(plicand))
    }

    for(let i = 0; i < plier.length; i++){
        multiplierIndices.push(i)
    }
    for(let i = plier.length+1;i < plicand.length + plier.length + 1; i++){
        multiplicandIndices.unshift(i)
    }
    let traySize = sp + plier.length + 1 + plicand.length + plier.length + 1
    let tray = new abacus(traySize)

    tray.set(plier,0)

    tray.set(plicand,plier.length+1)

    return [tray, multiplierIndices,multiplicandIndices,plicand,plier]
}
export function  multJPS(plier,plicand,getRidOfLeading0s=true,sp=0){
        let states = []
        const triple = prepForModMultJPS(plier,plicand,getRidOfLeading0s,sp)

        let lis = []

        for(const c of triple[0].backingList){
            lis.push(c)
        }
        states.push(lis)

        let prods = []
        let pp = triple[2][0] + 1
        plicand = triple[3]
        plier = triple[4]
        let valua = ""
        let valub = ""

        let productLength = plier.length + plicand.length

        for(const c of triple[2]){
            for(const d of triple[1]){
                valua = triple[0].value(c,1)[1]
                valub = triple[0].value(d,1)[1] 
                prods.push(mT[order[valua]][order[valub]])
            }
            for (let e = pp; e < pp+prods.length; e++){
                states = [...states,...triple[0].add(prods[e-pp],e)]
            }

            prods = []
            pp = pp-1
            triple[0].set("0",pp)
            lis = []

            for(const c of triple[0].backingList){
                lis.push(c)
            }
            states.push(lis)
        }
        let val = ""

        val = triple[0].value(plier.length + 2,plier.length + 2 + productLength-(plier.length+2))[1]
        let val2 = ''
        if(val[0] == "0"){
            for(let i = 1; i < val.length; i++){
                val2 = val2 + val[i]
            }
        }
        else{
            val2 = val;
        }
        return [stringize(convertToRegNum(val2)), states]

}

export function prepForMultCNS(plier, plicand){
    let multiplierIndices = []
    let multiplicandIndices = []

    for(let i = 0; i < plicand.length;i++){
        multiplicandIndices.unshift(i)
    }
    for(let j = plicand.length + plier.length+1; j < plier.length + plier.length + plicand.length + 1;j++){
        multiplierIndices.push(j)
    }
    let traySize = plier.length + 1 + plicand.length + plier.length

    let tray = new abacus(traySize)

    tray.set(plicand,0)

    tray.set(plier, plicand.length + plier.length + 1)

    return [tray, multiplierIndices,multiplicandIndices]

}

export function multCNS(plier,plicand){
    let states = []
    let triple = prepForMultCNS(plier,plicand)
    let lis = []

    for (const c of triple[0].backingList){
        lis.push(c)
    }
    states.push(lis)
    let prods = []
    let pp = triple[2][0] + 1
    let ppFirst = pp
    let productLength = plier.length + plicand.length

    let val1 = 0
    let val2 = 0
    for(const c of triple[2]){
        for(const d of triple[1]){
            val1 = order[triple[0].value(c,1)[1]]
            val2 = order[triple[0].value(d,1)[1]]
            prods.push(mT[val1][val2])
        }
        for(let e = pp; e < pp+prods.length; e++){
            states = [...states,...triple[0].add(prods[e-pp],e)]
        }
        prods = []
        pp = pp - 1
        triple[0].set("0",pp)
        lis = []
        for (const c of triple[0].backingList){
            lis.push(c)
        }
        states.push(lis)
    }
    let ppLast = pp
    let val = ""
    val = triple[0].value(1,productLength)[1]



    return [stringize(convertToRegNum(val)), states]
}
export function correctDigits(terms){
    let firstIdx = -1
    for(let i = 0; i < terms.length; i++){
        if(terms[i].length == 2){
            firstIdx = i
            break
        }
    }
    if(firstIdx == -1){
        return terms
    }
    terms[firstIdx-1] = String(parseInt(terms[firstIdx-1][0],10) + parseInt(terms[firstIdx][0],10))
    terms[firstIdx] = terms[firstIdx][1]
    return correctDigits(terms)
}

export function napiersBones(number, zeroThrough10){


    if(zeroThrough10 == "10"){
        let l = []
        for(let i = 0; i < number.length; i++){
            l.push(number[i])
            
        }
        if(l[0] == '0'){
            l.shift()
        }

        l = [...l,...'0']
        return l
    }
    else{
        let idx = parseInt(zeroThrough10)

       let pairs = []
       let terms = []
       let x = [0,0]
       let y = [0,0]
       let final = [0,0]

       terms.push(String(nB[idx][parseInt(number[0])][0]))

       for(let i = 1; i < number.length; i++){
            x = nB[idx][parseInt(number[i-1])]
            y = nB[idx][parseInt(number[i])]
            terms.push(String(nB[idx][parseInt(number[i-1])][1] + nB[idx][parseInt(number[i])][0]))

       }
       final = nB[idx][parseInt(number[number.length-1])]
       terms.push(String(final[1]))

       correctDigits(terms)

       return convertToRegNum(terms)


    }
}
export function chunkTable(num){
    let firstNonzeroIndexFound = false
    let quant = ""

    for(let i = 0; i < num.length; i++){
        if(num[i] != "0"){
            firstNonzeroIndexFound = true
        }
        if(firstNonzeroIndexFound){
            quant = quant + num[i]
        }
    }
    let table = []

    for(let i = 0; i < 11; i++){
        table.push(napiersBones(quant,String(i)))
    }
    return table
}

export function firstNonzeroDigit(idx,arr){
    if(idx >= arr.length-1){
        return 0
    }
    else if(arr[idx] != "0"){
        if(arr[idx] == "T"){
            return idx-1
        }
        return idx
    }
    else{
        return firstNonzeroDigit(idx+1,arr)
    }
}

export function division(dividend, divisor, extra=11, dontPutDecimal=false){
    let digCount = 1
    let decimalPlaced = false
    let listOfBoxes = []
    let states = []
    let lis = []
    let quotient = ""

    let tray = new abacus(dividend.length+extra)

    tray.set(dividend,0)
    for(const c of tray.backingList){
        lis.push(c)
    }
    states.push(lis)
    if(convertToRegNum(dividend) == "0"){
        return [[],"0",[Array.from(lis),['$','0','0'],lis]]
    }
    else if(convertToRegNum(divisor) == "0"){
        return ["err","err","err"]
    }

    let unitRod = dividend.length - 1
    let relevant = divisor.length + 2

    const cT = chunkTable(divisor)

    let start = 0
    let end = 0
    if(divisor.length >= dividend.length){
        end = dividend.length
    }
    else{
        end = divisor.length + 1
    }
    let box = []
    let offset = false
    let eye = 0
    let err = ""
    while(true){
        box = []
        if (end > tray.numberOfRods || (tray.compare(start,end-start,"0")[1] == ' = ' && end > unitRod+1)){
            break
        }

        if(tray.compare(start,end-start,cT[10])[1] == ' > ' || (tray.compare(start,end-start,"0")[1] == ' = ' ) && end > unitRod + 1){
            end = end - 1
            offset = true
        }

        for(let i = start; i < end; i++){
            box.push(tray.backingList[i])
        }

        for(let i = 0; i < 10; i++){
            console.log(tray.compare(start, end-start,cT[i])[1])
            console.log(tray.compare(start,end-start,cT[i])[1])
            console.log(tray.compare(start,end-start,cT[i+1])[1])
            if((tray.compare(start, end-start,cT[i])[1] == ' > ' || tray.compare(start,end-start,cT[i])[1] == ' = ') && (tray.compare(start,end-start,cT[i+1])[1] == ' < ')){
                eye = i
                break
            }
        }
        digCount = digCount + 1
        quotient = quotient + String(eye)

        states.push(['$',quotient,String(eye)])

        if(cT[eye].length < end-start){
            states = [...states,...tray.subt(cT[eye],start+1)]
        }
        else{
            states = [...states,...tray.subt(cT[eye],start)]
        }

        if (!decimalPlaced && end > unitRod && !dontPutDecimal){
            quotient = quotient + "."
            decimalPlaced = true
        }

        end = end + 1
        if(tray.backingList[start] == '0'){
            start = start + 1
        }
        listOfBoxes.push(box)
        err = tray.value(0,tray.numberOfRods)[1]
    }
    let quot2 = ""
    if(quotient[quotient.length-1] == "."){
        for(let i = 0; i < quotient.length-1;i++){
            quot2 = quot2 + quotient[i]
        }
        return [listOfBoxes,quot2,states,err,unitRod,cT]

    }
    else{
        return [listOfBoxes,quotient,states,err,unitRod,cT]
    }
}

export function napiersBonesForSqrt(number, zeroThrough9){

    
    const nBsqrt = [[0,0],[0,1],[0,4],[0,9],[1,6],[2,5],[3,6],[4,9],[6,4],[8,1]]
    let terms = []


    if(true){
        let idx = parseInt(zeroThrough9)

        let pairs = []
        let x = 0
        let y = 0
        terms.push(String(nB[idx][parseInt(number[0])][0]))

        for(let i = 1; i<number.length; i++){
            x = nB[idx][parseInt(number[i-1])]
            y = nB[idx][parseInt(number[i])]
            terms.push(String(nB[idx][parseInt(number[i-1])][1]+nB[idx][parseInt(number[i])][0]))
        }
        let final = nB[idx][parseInt(number[number.length-1])]
        terms.push(String(final[1]))
        terms.push(String(nBsqrt[idx][0])+String(nBsqrt[idx][1]))

        correctDigits(terms)
    }
    return convertToRegNum(terms)
}

function chunkTableForSqrt(num){
    let firstNonzeroIndexFound = false
    let quant = ""
    let table = []
    for (let i = 0; i < num.length; i++){
        if(num[i] != "0"){
            firstNonzeroIndexFound = true
        }
        if(firstNonzeroIndexFound){
            quant = quant + num[i]
        }
    }
    for(let i = 0; i < 10; i++){
        table.push(napiersBonesForSqrt(quant,String(i)))
    }
    return table
}


export function sqrt(sqr,rods=17){
    let flag = []
    let digCount = 1
    let states = []
    let lis = []
    let err = ""
    let end = 0

    let twoab = ""
    let root = ""
    let rootNoDec = ""

    let tray = new abacus(sqr.length+rods)

    tray.set(sqr,0)

    for(const c of tray.backingList){
        lis.push(c)
    }
    if(sqr == "0"){
        return ["0","0",[Array.from(lis),["$","0","0",''],lis],"0",0]
    }
    states.push(lis)
    let start = 0
    if(sqr.length % 2 == 0){
        end = 2
    }
    else{
        end = 1
    }
    let unitRod = sqr.length-1
    let decimalPlaced = false
    let cT = ["0","1","4","9","16","25","36","49","64","81"]
    let idx = 0
    while(true){
        if(end > tray.numberOfRods || (tray.compare(start,end-start,"0")[1] == " = " && end > unitRod+1)){
            break
        }

        for (let i = 0; i < 10; i++){
            if(i == 9){
                idx = i
                break
            }
            //console.log(tray.compare(start,end-start,cT[i]))
            if((tray.compare(start,end-start,cT[i])[1] == " > " || tray.compare(start,end-start,cT[i])[1] == ' = ') && tray.compare(start,end-start,cT[i+1])[1] == ' < '){
                idx = i
                break
            }
        }
        digCount = digCount + 1
        root = root + String(idx)
        rootNoDec = rootNoDec + String(idx)
        states.push(['$',root,String(idx),twoab])
        twoab = multJPS("2",rootNoDec)[0]

        if(cT[idx].length < end-start){
            states = [...states,...tray.subt(cT[idx],start+1)]
        }
        else{
            states = [...states,...tray.subt(cT[idx],start)]
        }

        if(!decimalPlaced && end > unitRod){
            root = root + '.'
            decimalPlaced = true
        }
        cT = chunkTableForSqrt(twoab)

        end = end+2
        if(tray.backingList[start] == "0"){
            start = firstNonzeroDigit(start,tray.backingList)
        }
    }
    err = tray.value(0,tray.numberOfRods)[1]

    let j = String(idx)

    let rt2 = ""
    if(root[root.length-1] == '.'){
        for(let i = 0; i < root.length-1;i++){
            rt2 = rt2 + root[i]}
        states.push(['$',rt2,j,twoab])
        return [rt2, err,states,twoab.length,unitRod, cT]
        
    }
    else{
        states.push(['$',root,j,twoab])
        return [root, err,states,twoab.length,unitRod, cT ]
    }
}

export function countLeading0s(input){
    let counter = 0
    for(const c of input){
        if(c == "0"){
            counter++
        }
        else{
            break
        }
    }
    return counter
}


export function fibo(sz){
    let seq = "1, 1, "
    let num = parseInt(sz)

    if(num < 9 || num%2 == 0){
        return 0
    }

    let freeRod = parseInt((num-1)/2)
    let tray = new abacus(num)
    let states = []
    let lis = []
    let terms = ["1"]

    tray.set("1", freeRod-1)
    tray.set("1")

    for(const c of tray.backingList){
        lis.push(c)
    }
    states.push(['$', seq])
    states.push(lis)

    let limit = ""
    for(let i = 0; i < parseInt(num-1)/2-1;i++){
        limit = limit + "9"
    }
    let flipper = 0

    let rightVal = null
    let noLeading0sRightVal = null
    let rightLeading0sCount = null
    let leftVal = null
    let noLeading0sLeftVal = null
    let leftLeading0sCount = null
    
    while(true){
        rightVal = tray.value(0,freeRod)[1]
        noLeading0sRightVal = convertToRegNum(rightVal)
        rightLeading0sCount = countLeading0s(rightVal)

        leftVal = tray.value(freeRod+1,freeRod)[1]
        noLeading0sLeftVal = convertToRegNum(leftVal)
        leftLeading0sCount = countLeading0s(leftVal)

        if(flipper % 2 == 0){
            states = [...states,...tray.add(noLeading0sLeftVal,0+leftLeading0sCount,true,true)]
            seq = seq + stringize(convertToRegNum(tray.value(0,freeRod)[1])) + ', '
            terms.push(noLeading0sLeftVal)
        }
        else{
            states = [...states,...tray.add(noLeading0sRightVal,freeRod+1+rightLeading0sCount,true,true)]
            seq = seq + stringize(convertToRegNum(tray.value(freeRod+1,freeRod)[1])) + ", "
            terms.push(noLeading0sRightVal)
        }
        if(tray.compare(0,freeRod,limit)[1] == " > " || tray.compare(freeRod+1,freeRod,limit)[1] == " > "){
            if(tray.compare(0,freeRod, limit)[1] == " > "){
                terms.push(tray.value(0,freeRod)[0])
                break
            }
            else if(tray.compare(freeRod+1,freeRod, limit)[1] == " > "){
                terms.push(tray.value(freeRod+1,freeRod)[0])
                break
            }
        }
        flipper = flipper + 1
        states.push(["$",seq])

    }
    states.push(["$",seq])

    return [states,terms]
}

export function reverseFibo(sz){
    let num = parseInt(sz)
    let terms = fibo(sz)[1]

    let freeRod = parseInt((num-1)/2)

    let tray = new abacus(num)

    let leftStart = terms[terms.length-1]
    let rightStart = terms[terms.length-2]

    let seq = ""
    seq = seq + stringize(leftStart) + ', ' + stringize(rightStart) + ', '

    tray.set(leftStart,freeRod-1-leftStart.length+1)
    tray.set(rightStart)

    let states = []
    let lis = []
    for(const c of tray.backingList){
        lis.push(c)
    }
    states.push(['$',seq])
    states.push(lis)

    let flipper = 0
    let rightVal = null
    let noLeading0sRightVal = null
    let rightLeading0sCount = null

    let leftVal = null
    let noLeading0sLeftVal = null
    let leftLeading0sCount = null
    while(true){
        rightVal = tray.value(0,freeRod)[1]
        noLeading0sRightVal = convertToRegNum(rightVal)
        rightLeading0sCount = countLeading0s(rightVal)

        leftVal = tray.value(freeRod+1,freeRod)[1]
        noLeading0sLeftVal = convertToRegNum(leftVal)
        leftLeading0sCount = countLeading0s(leftVal)
        if(tray.compare(0,freeRod, "1")[1] == " = " && tray.compare(freeRod+1,freeRod, "1")[1] == " = "){
            break
        }

        if (flipper % 2 == 0){
            
            for (let i = 0; i < freeRod; i++){
                if(tray.backingList[i] != '0'){
                    break
                }
            }
            states = [...states,...tray.subt(noLeading0sLeftVal,0+leftLeading0sCount,true)]
            seq = seq + stringize(convertToRegNum(tray.value(0,freeRod)[1])) + ', '
            
        }
        else{
            for(let i = freeRod; i < tray.backingList.length;i++){
                if(tray.backingList[i] != '0'){
                    break
                }
            }
            states = [...states,...tray.subt(noLeading0sRightVal,freeRod+1+rightLeading0sCount,true)]
            seq = seq + stringize(convertToRegNum(tray.value(freeRod+1,freeRod)[1])) + ', '
        }
        flipper = flipper + 1
        states.push(['$',seq])
            
    }
    return states


}
 export function sum(integ1,integ2){
    let i1 = null
    let i2 = null
    let summ = null
    if(integ1[0] == "-" && integ2[0] == "-"){
        i1 = ""
        i2 = ""

        for(let i = 1; i <integ1.length;i++){
            i1 = i1 + integ1[i]
        }
        for(let i = 1; i < integ2.length;i++){
            i2 = i2 + integ2[i]
        }
        summ = "-" + regAdd(i1,i2)[1]
    }
    else if(integ1[0] == "-"){
        i1 = ""
        for(let i = 1; i < integ1.length; i++){
            i1 = i1 + integ1[i]
        }
        summ = minus(integ2,i1)[1]
        
    }
    else if(integ2[0] == "-"){
        i2 = ""
        for(let i = 1; i < integ2.length; i++){
            i2 = i2 + integ2[1]
        }
        summ = minus(integ1,i2)[1]
    }
    else{
        summ = regAdd(integ1,integ2)[1]
    }
    return summ
}




/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

rational/terminating decimal stuff 

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

export function ratToDub(num){
    let built = null
    let inp = ""
    let negFlag = false

    if(num.length > 1 && num[0] == "-"){
        negFlag = true
        for(let i = 1; i < num.length; i++){
            inp = inp + num[i]
        }
    }
    else{
        for(let i = 0; i < num.length; i++){
            inp = inp + num[i]
        }
    }

    let idx = 0
    for(let i = 0; i< inp.length; i++){
        if(inp[i] == "."){
            idx = i
            break
        }
    }
    if(idx != 0){
        let ext = []
        for(let i = 0; i < inp.length; i++){
            if(inp[inp.length-i-1] == "."){
                continue
            }
            ext.push(inp[inp.length-i-1])
        }
        if(negFlag){
            return ['-' + stringize(convertToRegNum(reverse(ext))), String(idx-inp.length+1)]
        }
        else{
            return [stringize(convertToRegNum(reverse(ext))), String(idx-inp.length+1)]
        }
    }
    else{
        if(inp.length == 1){
            return [inp,"0"]
        }
        else{
            for(let i = 0; i < inp.length; i++){
                if(inp[inp.length-1-i] == "0"){
                    continue
                }
                else{
                    idx = inp.length-i-1
                    break
                }
            }
            built = ""
            let i = 0
            while(true){
                built = built + inp[i]
                i = i+1
                if(i > idx){
                    break
                }
            }
        }
    }
    if(negFlag){
        return ['-' + built, String(inp.length-idx-1)]
    }
    else{
        return [built, String(inp.length-idx-1)]
    }
}


export function dubToRat(dub){
    let  res = ""
    let space = dub[0].length

    if(dub[1][0] == '-'){
        let recess = ""
        if(dub[1].length == 2){
            recess = recess + dub[1][1]
        }
        else{
            for (let i = 1; i < dub[1].length; i++){
                recess = recess + dub[1][i]
            }
        }
        let head = ""
        let tail = ""
        if(parseInt(recess) < space){
            

            for(let i = 0; i < space-parseInt(recess);i++){
                head = head + dub[0][i]
            }
            for(let i = space-parseInt(recess);i < space;i++){
                tail = tail + dub[0][i]
            }
        }
        else if(parseInt(recess) == space){
            head = "0"
            tail = dub[0]
        }
        else{
            head = "0"
            tail = dub[0]
            for(let i = 0; i < parseInt(recess)-space;i++){
                tail = "0" + tail
            }
        }
        res = head + "." + tail
        return res
        
    }
    else if(dub[1] == "0"){
        res = dub[0]
        return res
    }
    else{
        res = dub[0]
        for(let i = 0; i < parseInt(dub[1]);i++){
            res = res + "0"
        }
        return res
    }
}

//console.log(dubToRat(["865","-6"]))

export function absolute(x,y){
    let x1 = ""
    let y1 = ""
    let negFlag = false

    if(x[0] == "-" && y[0] == "-"){
        if(x.length == 2){
            x1 = x[1]
        }
        else{
            for(let i = 1; i < x.length; i++){
                x1 = x1 + x[i]
            }
        }
        if(y.length == 2){
            y1 = y[1]
        }
        else{
            for(let i = 1; i < y.length; i++){
                y1 = y1 + y[i]
            }
        }
    }
    else if(x[0] == "-" || y[0] == "-"){
        if(x[0] == "-"){
            if(x.length == 2){
                x1 = x[1]
            }
            else{
                for(let i = 1; i < x.length; i++){
                    x1 = x1 + x[i]
                }
            }
            y1 = y
        }
        else{
            if(y.length == 2){
                y1 = y[1]
            }
            else{
                for(let i = 1; i < y.length; i++){
                    y1 = y1 + y[i]
                }
            }
            x1 = x
        }
        negFlag = true
    }
    else{
        x1 = x
        y1 = y
    }
    return [x1,y1,negFlag]
}

export function multRat(plier,plicand){
    let ab = absolute(plier,plicand)

    let plier1 = ab[0]
    let plicand1 = ab[1]
    let negFlag = ab[2]
    let dub1 = ratToDub(plier1)
    let dub2 = ratToDub(plicand1)

    let cd = multJPS(dub1[0],dub2[0])
    let firstElem = cd[0]

    let secElem = sum(dub1[1],dub2[1])

    let finDub = [firstElem,secElem]

    let res = dubToRat(finDub)



    if(negFlag){
        return["-"+res,cd.slice(1)]
    }
    else{
        return [res,cd.slice(1)]
    }


}

export function divRat(dividend,divisor){
    let trip = absolute(divisor,dividend)
    let divisor1 = trip[0]
    let dividend1 = trip[1]
    let negFlag = trip[2]


    let dub1 = ratToDub(dividend1)
    let dub2 = ratToDub(divisor1)

    let divRes = division(dub1[0],dub2[0])
    let firstElem = divRes[1]
    let sfe = String(firstElem)

    let newDub = ratToDub(sfe)
    let secElem = sum(newDub[1],sum(dub1[1],String(-1*parseInt(dub2[1]))))

    let sse = String(secElem)

    let finDub = [newDub[0],sse]

    let res = dubToRat(finDub)


    if(negFlag){
        return ["-"+res,divRes[2]]
    }
    else{
        return[res,divRes[2]]
    }
    
}

function breakRat(rat1,rat2){
    let h1 = ""
    let t1 = ""
    let h2 = ""
    let t2 = ""

    for(let i = 0; i < rat1.length; i++){
        if (rat1[i] == "."){
            break
        }
        h1 = h1 + rat1[i]
    }

    for(let i = h1.length+1;i < rat1.length; i++){
        t1 = t1 + rat1[i]
    }

    for(let i = 0; i < rat2.length; i++){
        if(rat2[i] == "."){
            break
        }
        h2 = h2 + rat2[i]
    }

    for(let i = h2.length+1; i < rat2.length;i++ ){
        t2 = t2 + rat2[i]
    }

    return [[h1,t1],[h2,t2]]
}



function padRat(rat1, rat2){
    let br = breakRat(rat1,rat2)

    let h1 = br[0][0]
    let t1 = br[0][1]
    let h2 = br[1][0]
    let t2 = br[1][1]

    let onesIdx = 0
    let biggerTailLen = 0
    let biggerHeadLen = 0

    let head1Len = h1.length
    let head2Len = h2.length

    let tail1Len = t1.length
    let tail2Len = t2.length

    let padTail = []
    let padhead = []
    let ret = []
    

    if(head1Len > head2Len){
        onesIdx = head1Len
        biggerHeadLen = head1Len
        for(let i = 0; i < head1Len - head2Len;i++){
            h2 = "0" + h2
        }
    }
    else if(head2Len > head1Len){
        biggerHeadLen = head2Len
        onesIdx = head2Len
        for(let i = 0; i < head2Len-head1Len; i++){
            h1 = "0" + h1
        }
    }
    else{
        biggerHeadLen = head2Len
        onesIdx = head2Len
    }
    if(tail1Len > tail2Len){
        biggerTailLen = tail1Len
        for(let i = 0; i < tail1Len-tail2Len;i++){
            t2 = t2 + "0"
        }
    }
    else if(tail2Len > tail1Len){
        biggerTailLen = tail2Len
        for(let i = 0; i < tail2Len-tail1Len;i++){
            t1 = t1 + "0"
        }

    }
    else{
        biggerTailLen = tail2Len
    }

    return [[h1,t1],[h2,t2],onesIdx,biggerHeadLen,biggerTailLen]
}

function compRat(rat1,rat2){
    let tuple = padRat(rat1,rat2)
    let firstHead = tuple[0][0]
    let firstTail = tuple[0][1]

    let secHead = tuple[1][0]
    let secTail = tuple[1][1]

    let trip = [rat1, " = ", rat2]

    for(let i = 0; i < tuple[3];i++){
        if(parseInt(firstHead[i]) > parseInt(secHead[i])){
            trip[1] = " > "
            return trip
        }
        else if (parseInt(firstHead[i]) < parseInt(secHead[i])){
            trip[1] = " < "
            return trip
        }
    }

    for(let i = 0; i < tuple[4];i++){
        if(parseInt(firstTail[i]) > parseInt(secTail[i])){
            trip[1] = " > "
            return trip
        }
        else if(parseInt(firstTail[i]) < parseInt(secTail[i])){
            trip[1] = " < "
            return trip
        }
    }

    return trip
}


//this doesn't return a TD: addRat("99.99","0.01")[0] == "100.00"
//is that a problem? Do I need a function that translates
//input into a TD? I don't think so. What would it do and how would it work
//it would chop off the decimal part 
//if all the digits to the right of the . are 0
//

function takeOff0s(rat){
    let revRat = reverse(rat)
    let idx = 0
    for(let i = 0; i < revRat.length; i++){
        if(revRat[i] == "0"){
            continue
        }
        else{
            idx = i
            break
        }
    }
    let newRat = ""

    for (let i = 0; i < rat.length-idx; i++){
        newRat = newRat + rat[i]
    }

    if(newRat[newRat.length-1] == "."){
        newRat = newRat.slice(0,newRat.length-1)
    }
    
    return newRat
    
}



export function addRat(rat1,rat2){
    let tuple1 = padRat(rat1,rat2)
    let tuple2 = compRat(rat1,rat2)
    unitRod = tuple1[2] - 1

    let frame = new abacus(tuple1[3]+tuple1[4]+1)
    let prin = []

    if(tuple2[1] == " > "){
        prin = frame.set(tuple1[0][0]+tuple1[0][1],1)[0]
        
        prin = [...prin,...frame.add(tuple1[1][0]+tuple1[1][1],1,false)]

    }
    else{
        prin = frame.set(tuple1[1][0]+tuple1[1][1],1)[0]
        prin = [...prin,...frame.add(tuple1[0][0]+tuple1[0][1],1,false)]
    }

    //this should take off the carrying rod
    let sm = frame.value(0,frame.backingList.length)[1]
    if(sm[0] == "0"){
        sm = frame.value(1,frame.backingList.length-1)[1]
    }
    
    

    let res = ""
    let built = ""

    for(let i = 0; i < tuple1[2]; i++){
        built = built + sm[i]
    }
    if(sm.length-tuple1[2] > 0){
        built = built + "."
        for (let i = tuple1[2]; i < sm.length; i++){
            built = built + sm[i]
        }
    }
    
    built = stringize(convertToRegNum(built))
    if(built[0] == "."){
        built = "0" + built
    }
    return [takeOff0s(built),prin]

}

export function subtRat(rat1,rat2){
    let tuple1 = padRat(rat1,rat2)
    let tuple2 = compRat(rat1,rat2)

    unitRod = tuple1[2] - 2

    let negFlag = false
    let prin = []

    let frame = new abacus(tuple1[3]+tuple1[4])

    if(tuple2[1] == " > "){
        prin = frame.set(tuple1[0][0]+tuple1[0][1],0)[0]
        prin = [...prin,...frame.subt(tuple1[1][0]+tuple1[1][1],0,false)]
    }
    else{
        negFlag = true
        prin = prin = frame.set(tuple1[1][0]+tuple1[1][1],0)[0]
        prin = [...prin,...frame.subt(tuple1[0][0]+tuple1[0][1],0,false)]

    }



    let dec = tuple1[2]
    let sm = frame.value(0, frame.backingList.length)[1]

    let res = ""

    let j = 0

    for(let i = 0; i < dec; i++ ){
        res = res + sm[i]
        j = j + 1
    }
    if(j != sm.length){
        res = res + "."

        for(let i = dec; i < sm.length;i++){
            res = res + sm[i]
        }
    }
    let built = stringize(convertToRegNum(res))
    if(built[0] == "."){
        built = "0" + built
    }
    if(negFlag){
        if(built == "0" || built == ".0" || built == "0."){
            return ["0",prin]
        }
        else{
            return ["-"+built,prin]
        }
    }
    return [built,prin]
}
//this is not a helper function strangely.
//Should I give the user access to this
//in the UI
export function addRatBothSigns(rat1,rat2){
    let signs = [null,null]
    let returnable = ""

    if(rat1[0] == "-" && rat2[0] == "-"){
        signs = absolute(rat1,rat2)
        rat1 = signs[0]
        rat2 = signs[1]
        returnable = "-" + addRat(rat1,rat2)
        unitRod = unitRod + 1
        return returnable
    }
    else if (rat1[0] == "-"){
        signs = absolute(rat1,rat2)
        rat1 = signs[0]
        returnable = subtRat(rat2,rat1)
        unitRod = unitRod+1
        return returnable
    }
    else if(rat2[0] == "-"){
        signs = absolute(rat1,rat2)
        rat2 = signs[1]
        returnable = subtRat(rat1,rat2)
        unitRod = unitRod + 1
        return returnable
    }
    else{
        returnable = addRat(rat1,rat2)
        unitRod = unitRod + 1
        return returnable
    }
}

export function sqrtRatNoNewtons(input){
    let negFlag = false
    let newInp = ""
    let split = null
    let oper  = null
    let newRat = null
    let newPair = [null, null]
    let root = null
    if(input[0] == "-"){
        negFlag = true
        for(let i = 1; i < input.length; i++){
            newInp = newInp + input[i]
        }
         
    }
    else{
        newInp = input
    }
    split = ratToDub(newInp)

    if(parseInt(split[1]) >= 0){
        oper = sqrt(split[0])
        newRat = oper[0]

    }
    else{
        if(Math.abs(parseInt(split[1])) % 2 == 0){
            oper = sqrt(split[0])
            newPair = ratToDub(oper[0])
            newRat = dubToRat([newPair[0], String(parseInt(newPair[1]) + parseInt(split[1])/2)])
        }
        else{
            if(Math.abs(parseInt(split[1])) == 1){
                oper = sqrt(split[0] + "0")
                newPair = ratToDub(oper[0])
                newRat = dubToRat([newPair[0],String(parseInt(newPair[1])-1)])
            }
            else{
                oper = sqrt(split[0] + "0")
                root = oper[0]
                newPair = ratToDub(root)
                newRat = dubToRat([newPair[0],String(parseInt(newPair[1]) + parseInt((parseInt(split[1])+1)/2) - 1)])
            }
        }
    }
    if(negFlag){
        newRat = newRat + "i"
    }
    return [newRat, oper[2]]
}

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

division text

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

function ratToDub2(num){
    let idx = 0
    for(let i = 0; i < num.length; i++){
        idx = 0
        if (num[i] == "."){
            idx = i
            break
        }
    }
    let ext = []
    if (idx != 0){
        for (let i = 0; i < num.length;i++){
            if (num[num.length-1-i] == "."){
                continue
            }
            
            ext.push(num[num.length-i-1])
        }
    return [stringize(convertToRegNum(reverse(ext))),String(idx-num.length+1)]

    }
    else{
        let built = ""
        if(num.length == 1){
            return [num,"0"]
        }
        else{

            for(let i = 0; i < num.length; i++){
                if(num[num.length-1-i] == '0'){
                    continue
                }
                else{
                    idx = num.length-i-1
                    break
                }
            }
            
            let i = 0
            while(true){
                built = built + num[i]
                i = i+1
                if (i > idx){
                    break
                }
            }

        }
        return [built,String(num.length-idx-1)]
    }
}
function dubToRat2(dub){
    let res = ""
    let recess = ""
    const space = dub[0].length
    if (dub[1][0] == "-"){
        if(dub[1].length == 2){
            recess = recess + dub[1][1]
        }
        else{
            for (let i = 1; i < dub[1].length; i++){
                recess = recess + dub[1][i]
            }
        }
        let head = ""
        let tail = ""
        let amt = Number.parseInt(recess,10)
        if (amt < space){
            
            for(let i = 0; i < space - amt; i++){
                head = head + dub[0][i]
            }
            for(let i = space-amt; i < space; i++){
                tail = tail + dub[0][i]
            }

        }
        else if (amt == space){
            head = "0"
            tail = dub[0]
        }
        else{
            head = "0"
            tail = dub[0]
            for (let i = 0; i < amt-space; i++){
                tail = "0" + tail
            }
        }
        res = head + "." + tail
        return res
    }
    else if (dub[1] == "0"){
        res = dub[0]
        return res
    }
    else{
        res = dub[0]
        let aamt = Number.parseInt(dub[1],10)
        for(let i = 0; i < aamt; i++){
            res = res + "0"
        }
    return res
    }
    
}
function breakRat2(rat1,rat2){
    let h1 = ""
    let t1 = ""
    let h2 = ""
    let t2 = ""

    for(let i = 0; i < rat1.length; i++){
        if(rat1[i] == "."){
            break
        }
        h1 = h1 + rat1[i]
    }
    for(let i = h1.length+1; i < rat1.length; i++){
        t1 = t1 + rat1[i]
    }
    for (let i = 0; i < rat2.length; i++){
        if(rat2[i] == "."){
            break
        }
        h2 = h2 + rat2[i]
    }
    for (let i = h2.length+1; i < rat2.length; i++){
        t2 = t2 + rat2[i]
    }
    return [[h1,t1], [h2,t2]]
}
function padRat2(rat1,rat2){
    const br = breakRat2(rat1,rat2)

    let h1 = br[0][0]
    let t1 = br[0][1]
    let h2 = br[1][0]
    let t2 = br[1][1]

    let onesIdx = 0
    let biggerTailLen = 0
    let biggerHeadLen = 0

    let head1Len = h1.length
    let head2Len = h2.length

    let tail1Len = t1.length
    let tail2Len = t2.length

    let padTail = []
    let padHead = []
    let ret = []
    if(head1Len > head2Len){
        onesIdx = head1Len
        biggerHeadLen = head1Len
        for(let i = 0; i < head1Len - head2Len; i++){
            h2 = " " + h2
        }
    }
    else if(head2Len > head1Len){
        biggerHeadLen = head2Len
        onesIdx = head2Len
        for (let i = 0; i < head2Len - head1Len; i++){
            h1 = " " + h1
        }
    }
    else{
        biggerHeadLen = head2Len
        onesIdx = head2Len
    }

    if (tail1Len > tail2Len){
        biggerTailLen = tail1Len
        for(let i = 0; i < tail1Len-tail2Len;i++){
            t2 = t2 + " "
        }
    }
    else if(tail2Len > tail1Len){
        biggerTailLen = tail2Len
        for (let i = 0; i < tail2Len-tail1Len;i++){
            t1 = t1 + " "
        }
    }
    else{
        biggerTailLen = tail2Len
    }
    return [[h1,t1], [h2,t2], onesIdx, biggerHeadLen, biggerTailLen]


}
function alignUnit(rat1,rat2){
    const p = padRat2(rat1,rat2)
    const dubs = [p[0],p[1]]
    let line1 = ""
    let line2 = ""
    if(dubs[0][1].length == 0){
        line1 = "  " + dubs[0][0]

    }
    else{
        line1 = "  " + dubs[0][0] + "." + dubs[0][1]

    }
    if(dubs[1][1].length == 0){
        line2 = "- " + dubs[1][0] 

    }
    else{
        line2 = "- " + dubs[1][0] + "." + dubs[1][1]

    }
    
    
    const stack = line1 + "\n" + line2

    return stack
}


function checkE(num){
    for (let i = 0; i < num.length; i++){
        if (num[i] == "e"){
            return [true, i]
        }

    }
    return [false, num.length-1]
}

function getRidOfE(expNum){
    let checker = checkE(expNum)
    let head = ""
    let tail = ""
    let exp = ""
    if (checker[0]){
        for (let i = 0; i < checker[1]; i++){
            head = head + expNum[i]
        }

        for (let i = checker[1]+1; i < expNum.length; i++){
            tail = tail + expNum[i]
        }

        let dub = ratToDub2(head)
        dub[1] = String(parseInt(dub[1],10) + parseInt(tail,10))
        let newRat = dubToRat2(dub)
        return newRat
    }
    else{
        return null
    }
}
function chunkTableSimple(num){
    let cT = []

    const decNum = num

    for (let i = 0; i < 11; i++){
        cT.push(new Decimal(decNum*i))
    }

    return cT
}

export function longDiv(dividend,divisor){
    if (dividend == "0"){
        return "0"
    }
    let quot = ""
    const c = dividend
    const d = divisor
    let bn = new Decimal(0)
    
    const lenC = c.length
    const lenD = d.length

    const i = lenC - 1
    const j = lenD - 1

    const decC = parseFloat(c)
    const decD = parseFloat(d)
    let xn = new Decimal(0)
    let xn1 = new Decimal(0)

    let head = ""
    const cT = chunkTableSimple(d)


    

    let steps = []

    if (decC == decD){
        bn = Decimal(0)
    }


    else if (lenD >= lenC){ 
        bn = Decimal(0)
    }

    else{
        for (let k = 0; k < lenD+1; k++){
            head = head + c[k]
        }

        let decHead = parseFloat(head)

        if (decHead > cT[10]){
            bn = Decimal(i - j)
        }
        else{
            bn = Decimal(i - j - 1)
        }
    }

    let yn = new Decimal(decC)
    let decFlag = false

    while(true){
        let curr = 0
        for (let i = 0; i < cT.length - 1; i++){

            xn = cT[i].times(new Decimal(10).pow(bn))
            xn1 = cT[i+1].times(new Decimal(10).pow(bn))
            let c1 = yn.comparedTo(xn)
            let c2 = yn.comparedTo(xn1)
            if ((c1 == 1 || c1 == 0) && c2 == -1){
                curr = i 
                break
            }
        }
        let stx = String(xn)
        let sty = String(yn)
        if (checkE(stx)[0]){
            stx = getRidOfE(stx)
        }
        if(checkE(sty)[0]){
            sty = getRidOfE(sty)
        }
        let stack = alignUnit(sty,stx)

    
        
        let ticks = "-"
        for (let i = 0; i < sty.length; i++){
            ticks = ticks + "-"
        }

        

        yn = yn.minus(xn)

        let out = String(yn)

        if (checkE(out)[0]){
            out = getRidOfE(out)
        }

  
        let st = `${stack}\n${ticks}\n  ${out}\n `
        steps.push(st)

        quot = quot + String(curr)

        bn = bn.minus(1)
        

        if (yn == 0){
            break
        }

        if (bn < 0 && !decFlag){
            decFlag = true
            quot = quot + "."
        }

        if (bn < -17){
            break
        }

    }

    return [quot, steps]

}

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

binary lattice for decimal

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

export function makeGalGrid(n1,n2){
    let gg = [];
    let gg2 = [];

    for (const c of n2){
        //console.log(c);
        gg2 = [];
        for (const d of n1){

            gg2.push(nB[+c][+d]);
        }
        gg.push(gg2);
    }
        
    
    return gg;

}


export function tripLists(n,m){
    let tripList = [];
    let subList = [];

    for (let k = 0; k < n+m; k++){
        let trip = [];
        let subList = [];
        for (let p = 0; p < 2; p++){
            for (let i = 0; i < n; i++){
                for (let j = 0; j < m; j++){
                    if(i+j+p == k){
                        trip = [i,j,p]
                        subList.push(trip)
                        if (j > k || i > k){
                            break

                        }
                        
                    }

                }
            }
        }
        tripList.push(subList)

    }
    return tripList
}



export function sumLists(gelGrid){
    let n = gelGrid.length
    let m = gelGrid[0].length

    let tl = tripLists(n,m)

    let sumList = []

    for (const x of tl){
        let sum = 0

        for (const y of x){
            let i = y[0]
            let j = y[1]
            let p = y[2]
            sum = sum + gelGrid[i][j][p]
        }
        sumList.push(String(sum))

    }
    return sumList
}


export function diagSum(num1,num2){
    let gel = makeGalGrid(num1,num2)

    let sl = sumLists(gel)

    return sl
}


export function correctDigits2(terms){
   let firstIdx = -1

    for (let i = 0; i < terms.length; i++){
        if (terms[i].length > 1){
            firstIdx = i;
            break;

        }
    }
    if (firstIdx == -1){
        return terms
    }
    terms[firstIdx - 1] = String(parseInt(terms[firstIdx-1][0],10)+parseInt(terms[firstIdx].slice(0,terms[firstIdx].length-1),10))
    terms[firstIdx] = terms[firstIdx][terms[firstIdx].length-1] 
    return correctDigits2(terms)   
    
}



export function latticeMult(num1,num2){
    let sums = diagSum(num1, num2)
    let corr = correctDigits2(sums)

    return corr
}

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

binary lattice mult

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

function corrDig(num, idx){
    let lis = listize(num)

    let inp = ""

    if(idx == 0){
        lis[0] = "1"


        return stringize(lis)
    }
    else if(lis[idx] == "0"){
        lis[idx] = "1"

        return stringize(lis)
    }
    else{
        lis[idx] = "0"
        inp = stringize(lis)
        return corrDig(inp,idx-1)
    }
}

export function binAddLat(inp1,inp2){

    let longer = inp2
    let shorter = inp1
    let res = []
    let inp = ""

    if(inp2.length < inp1.length){
        longer = inp1
        shorter = inp2

    }
    res = [..."0",...listize(longer)]

    let offset = 0
    for(let i = 0; i < shorter.length;i++){
        offset = res.length - shorter.length

        if(shorter[i] == "1" && res[i+offset] == "0"){
            res[i+offset] = "1"

        }
        else if(shorter[i] == "1" && res[i+offset] == "1"){
            inp = stringize(res)
            res = listize(corrDig(inp,i+offset))

        }
        else{
            continue
        }
    }
    if(res[0] == "0"){
        res.shift()
    }
    return stringize(res)
}

const nBBin = [[[0,0],[0,0]],
      [[0,0],[0,1]]]

export function makeGalGrid2(n1,n2){
    let gg = [];
    let gg2 = [];

    for (const c of n2){

        gg2 = [];
        for (const d of n1){

            gg2.push(nBBin[+c][+d]);
        }
        gg.push(gg2);
    }
        
    
    return gg;

}


export function tripLists2(n,m){
    let tripList = [];
    let subList = [];

    for (let k = 0; k < n+m; k++){
        let trip = [];
        let subList = [];
        for (let p = 0; p < 2; p++){
            for (let i = 0; i < n; i++){
                for (let j = 0; j < m; j++){
                    if(i+j+p == k){
                        trip = [i,j,p]
                        subList.push(trip)
                        if (j > k || i > k){
                            break

                        }
                        
                    }

                }
            }
        }
        tripList.push(subList)

    }
    return tripList
}


export function sumLists2(gelGrid){
    let n = gelGrid.length
    let m = gelGrid[0].length

    let tl = tripLists2(n,m)

    let sumList = []

    for (const x of tl){
        let sum = 0

        for (const y of x){
            let i = y[0]
            let j = y[1]
            let p = y[2]
            sum = binAddLat(sum,String(gelGrid[i][j][p]))
        }
        sumList.push(String(sum))

    }
    return sumList
}



export function diagSum2(num1,num2){
    let gel = makeGalGrid2(num1,num2)

    let sl = sumLists2(gel)

    return sl
}

export function correctDigits3(terms){
   let firstIdx = -1

    for (let i = 0; i < terms.length; i++){
        if (terms[i].length > 1){
            firstIdx = i;
            break;

        }
    }
    if (firstIdx == -1){
        return terms
    }

    terms[firstIdx - 1] = binAddLat(terms[firstIdx-1][0],terms[firstIdx].slice(0,terms[firstIdx].length-1))
    terms[firstIdx] = terms[firstIdx][terms[firstIdx].length-1] 
    return correctDigits3(terms)   
    
}



export function binLatMult(num1,num2){
    let sums = diagSum2(num1, num2)
    let corr = correctDigits3(sums)

    return corr
}

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

binary abacus

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

export function decToBin(dec){
    let bits = []
    let bit = 0
    let reversed = []

    while(true){
        if(dec == 1){
            bits.push("1")
            break
        }
        else if(dec == 0){
            bits.push("0")
            break
        }
        else{
            bit = dec % 2
            dec = Math.floor(dec / 2);
            bits.push(bit)
        }
    }
    for(const c of bits){
        reversed = [...String(c),...reversed]
    }
    return stringize(reversed)
}

function compareBins(bin1,bin2){
    bin1 = convertToRegNum(bin1)
    bin2 = convertToRegNum(bin2)

    if(bin1.length > bin2.length){
        return [bin1, ">", bin2]
    }
    else if (bin2.length > bin1.length){
        return [bin1, "<", bin2]
    }
    else{
        for(let i = 0; i< bin1.length;i++){
            if(bin1[i] > bin2[i]){
                return [bin1, ">", bin2]
            }
            else if(bin1[i] < bin2[i]){
                return [bin1, "<", bin2]
            }
        }
        return [bin1, "=", bin2]
    }
}

function corrDig3(num, idx, contents){
    let lis = listize(num)
    let content = []
    let inp = ""
    for(const c of lis){
        content.push(c)
    }
    contents.push(content)
    if(idx == 0){
        lis[0] = "1"
        content = []
        for(const c of lis){
            content.push(c)
        }
        contents.push(content)
        return stringize(lis)
    }
    else if(lis[idx] == "0"){
        lis[idx] = "1"
        content = []
        for(const c of lis){
            content.push(c)
        }
        contents.push(content)
        return stringize(lis)
    }
    else{
        lis[idx] = "0"
        inp = stringize(lis)
        return corrDig3(inp,idx-1,contents)
    }
}

function corrDig4(num, idx, contents){
    let lis = listize(num)
    let content = []

    for (const c of lis){
        content.push(c)
    }
    contents.push(content)
    if(idx == 0){
        lis[0] = "0"
        content = []
        for(const c of lis){
            content.push(c)
        }
        contents.push(content)
        return stringize(lis)
    }
    else if(lis[idx] == "1"){
        lis[idx] = "0"
        content = []
        for(const c of lis){
            content.push(c)
        }
        contents.push(content)
        return stringize(lis)
    }
    else{
        lis[idx] = "1"
       let inp = stringize(lis)
        return corrDig4(inp,idx-1,contents)
    }
}

export function binAdd(inp1,inp2){
    let content = []
    let contents = []
    let longer = inp2
    let shorter = inp1
    let res = []
    let inp = ""

    if(inp2.length < inp1.length){
        longer = inp1
        shorter = inp2

    }
    res = [..."0",...listize(longer)]
    for(const c of res){
        content.push(c)
    }
    contents.push(content)
    let offset = 0
    for(let i = 0; i < shorter.length;i++){
        offset = res.length - shorter.length

        if(shorter[i] == "1" && res[i+offset] == "0"){
            res[i+offset] = "1"
            content = []
            for(const c of res){
                content.push(c)
            }
            contents.push(content)
        }
        else if(shorter[i] == "1" && res[i+offset] == "1"){
            inp = stringize(res)
            res = listize(corrDig3(inp,i+offset,contents))

        }
        else{
            continue
        }
    }
    if(res[0] == "0"){
        res.shift()
    }
    return[stringize(res), contents]
}

export function binSubt(inp1,inp2){
    let check = compareBins(inp1,inp2)
    let contents = []
    let content = []

    let neg = false
    let minuend = null
    let subtrahend = null
    let resu = null
    if(check[1] == "<"){
        minuend = inp2
        subtrahend = inp1
        neg = true
    }
    else{
        minuend = inp1
        subtrahend = inp2
    }

    let res = listize(minuend)

    for(let c of res){
        content.push(c)
    }
    contents.push(content)

    if(subtrahend == "0"){
        if(neg){
            return ["-" + stringize(res), contents]
        }
        return [stringize(res),contents]
    }
    for(let i = 0; i < subtrahend.length; i++){
        let offset = res.length - subtrahend.length

        if(subtrahend[i] == "1" && res[i+offset] == "1"){
            res[i+offset] = "0"
            content = []
            for(let c of res){
                content.push(c)
            }
            contents.push(content)
        }
        else if(subtrahend[i] == "1" && res[i+offset] == "0"){
            let inp = stringize(res)
            res = listize(corrDig4(inp,i+offset,contents))
        }
        else{
            continue
        }
        resu = stringize(res)
        if(neg){
            resu = "-" + resu
        }
    }
    return [resu, contents]
}

export function BLD(dividend,divisor){
    let states = []
    let display = listize(dividend)

    let onesIdx = display.length

    for(let i = 0; i < 3 + dividend.length + divisor.length;i++){
        display.push("0")
    }

    let box1 = 0
    let box2 = null
    if(divisor.length >= dividend.length){
        box2 = dividend.length
    }
    else{
        box2 = divisor.length + 1
    }

    let quot = ""

    let pastOnes = false
    let offset = false
    let reading = []

    while(true){
        let box = []
        let rs = []
        
        for(let i = box1; i < box2; i++){
            box.push(display[i])
        }

        if(compareBins(stringize(box),divisor + "0")[1] == ">" || compareBins(stringize(box),divisor + "0")[1] == "="){
            box2 = box2-1
            offset = true
        }

        if(box2 >= display.length){
            break
        }
        let inte = display.length-1

        if(pastOnes){
            for(let i = 0; i < display.length; i++){
                if(display[i] == "0"){
                    
                    continue
                }
                else if(display[i] != "0"){
                    inte = i
                    break
                }
            }
            if(inte == display.length-1){
                return [quot,states]
            }
        }

        if(!pastOnes && box2 > onesIdx){
            pastOnes = true

            for(let i = 0; i < display.length;i++){
                if(display[i] == "0"){
                    
                    continue
                }
                else if(display[i] != "0"){
                    inte = i
                    break
                }
            }
            if(inte == display.length-1){
                return [quot,states]
            }
            quot = quot + "."
        }
        box = []

        for(let i = box1; i < box2; i++){
            box.push(display[i])
        }

        let sb = stringize(box)

        let cb = compareBins(sb, divisor)

        if(cb[1] == "<"){
            quot = quot + "0"
            if(display[box1] == '0'){
                box1 = box1 + 1
            }
            box2 = box2 + 1
            continue
        }
        else{
            quot = quot + "1"
            rs = binSubt(stringize(box),divisor)
        }

        if(rs[0].length < box.length){
            for (let i = 0; i < box.length-rs[0].length;i++){
                rs[0] = "0" + rs[0]
            }
        }
        for(const c of rs[1]){
            for(let i = box1; i < box2; i++){
                display[i] = c[i-box1]
            }
            reading = []

            for(const k of display){
                reading.push(k)
            }
            states.push(reading)
        }
        if(display[box1] == '0'){
            box1 = box1 + 1
        }
        box2 = box2 + 1

    }

    reading = []
    for(const c of display){
        reading.push(c)
    }
    states.push(reading)

    return [quot,states]

}

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

Newton's method for cube roots.

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

function cubeRootIt(approx,cube,acc=5){
    let abacusActivity = [["%"," multiply " + String(approx) + " by " + String(approx)]]

    let dub1 = multRat(approx,approx)
    let xsqr = dub1[0]

    for(const c of dub1[1]){
        abacusActivity.push(c)
    }
    let br = breakRat(xsqr,xsqr)[0]
    let corr = ""
    
    if(br[1].length > acc){
        corr = br[0] + "."
        for(let i = 0; i < acc; i++){
            corr = corr + br[1][i]
        }
        xsqr = corr
    }
    abacusActivity.push(["%"," multiply " + String(approx) + " by " + String(xsqr)])
    let dub2 = multRat(approx,xsqr)
    let xcb = dub2[0]
    for (const c of dub2[1]){
        abacusActivity.push(c)
    }
    br = breakRat(xcb,xcb)[0]
    corr = ""
    if(br[1].length >acc){
        corr = br[0] + '.'
        for(let i = 0; i < acc; i++){
            corr = corr + br[1][i]
        }
        xcb = corr
    }
    abacusActivity.push(["%"," subtract " + String(cube) + " from " + String(xcb) ])
    let dub3 = subtRat(xcb,cube)
    let numer = dub3[0]
    for(const c of dub3[1]){
        abacusActivity.push(c)
    }
    abacusActivity.push(["%"," multiply " + String(xsqr) + " by " + "3"])
    let dub4 = multRat("3",xsqr)
    let denom = dub4[0]
    for(const c of dub4[1]){
        abacusActivity.push(c)
    }
    abacusActivity.push(["%"," divide " + String(numer) + " by " + String(denom)])
    let dub5 = divRat(numer,denom)
    let quot = dub5[0]

    for (const c of dub5[1]){
        abacusActivity.push(c)
    }
    let xn1 = ""
    if(quot[0] == '-'){
        quot = absolute(quot, quot)[0]
        abacusActivity.push(["%"," add " + String(approx) + " to " + String(quot)])

        let dub6 = addRat(approx, quot)
        xn1 = dub6[0]

        for(const c of dub6[1]){
            abacusActivity.push(c)
        }
    }
    else{
        abacusActivity.push(["%"," subtract " + String(quot) + " from " + String(approx)])
        let dub7 = subtRat(approx,quot)

        xn1 = dub7[0]

        for(const c of dub7[1]){
            abacusActivity.push(c)
        }
    }
    return ["result: " + String(xn1),abacusActivity]


}

export function cubeRoot(approx, cube,acc=5,its=5){
    let it = approx
    for (let i = 0; i< its; i++){
        if(i == 0){
            it = cubeRootIt(approx,cube,acc)
        }
        else{
            it = cubeRootIt(it[0],cube,acc)
        }
    }
    return it
}

