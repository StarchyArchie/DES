//Vishal Nigam

import React, { Component } from 'react';

let globalVars = {
    C: null,
    D: null,
    CxDx: null,
    Kn: null,
    R: '',
    L: '',
    B: null,
}


class DESCompiler extends Component {

    constructor(){
        super();
        this.state={
            textIn: '',
            keyIn: '',
            tmpStr: '',
            binaryInput: '',
            binaryOutput: '',
            stringOutput: '',
            stringInput: 'My Message',
            direction: true,
            sBoxes: null, 
            key: 'Enter a Binary Key or hit Default Key',
            errorMessage: false,
            defaultKey: '0001001100110100010101110111100110011011101111001101111111110001',
            encMess: '',
        };

    }


    convertToBinary(input) {
        let binaryString = '';
        for (var i = 0; i < input.length; i++) {
            binaryString += input[i].charCodeAt(0).toString(2);
        }

        // If less than 64 bits add zeroes to the end to make it 64 long
        if(binaryString.length<64){
              let diff = 64 - binaryString.length;
              ////console.log(binaryString.length);
              ////console.log('Diff: '+diff);
              let fillerString = new String('0').repeat(diff);
              ////console.log('Filler String: '+fillerString);
              let extend = binaryString.concat(fillerString);
              ////console.log(extend);
              binaryString = extend;
        }
        return binaryString;
      }


    keyToBinary(input) {

    }
 
    handleChange = (userInput) => {
        this.setState({ [userInput.target.name]: userInput.target.value });
      };

    handleClick = () =>{
        this.setState({stringInput: this.state.textIn});
    }

    //Generates all keys from K1 to K16 given K0
    generateKeys(key){
        //              PC-1
        //  57  49    41   33    25    17    9 //
        //  1   58    50   42    34    26   18 //
        // 10    2    59   51    43    35   27 //
        // 19   11     3   60    52    44   36 //
        // 63   55    47   39    31    23   15 //
        //  7   62    54   46    38    30   22 //
        // 14    6    61   53    45    37   29 //
        // 21   13     5   28    20    12    4 //
        let Kplus =[key.charAt(56),key.charAt(48),key.charAt(40),key.charAt(32),key.charAt(24),key.charAt(16),key.charAt(8),
            key.charAt(0),key.charAt(57),key.charAt(49),key.charAt(41),key.charAt(33),key.charAt(25),key.charAt(17),
            key.charAt(9),key.charAt(1),key.charAt(58),key.charAt(50),key.charAt(42),key.charAt(34),key.charAt(26),
            key.charAt(18),key.charAt(10),key.charAt(2),key.charAt(59),key.charAt(51),key.charAt(43),key.charAt(35),
            key.charAt(62),key.charAt(54),key.charAt(46),key.charAt(38),key.charAt(30),key.charAt(22),key.charAt(14),
            key.charAt(6),key.charAt(61),key.charAt(53),key.charAt(45),key.charAt(37),key.charAt(29),key.charAt(21),
            key.charAt(13),key.charAt(5),key.charAt(60),key.charAt(52),key.charAt(44),key.charAt(36),key.charAt(28),
            key.charAt(20),key.charAt(12),key.charAt(4),key.charAt(27),key.charAt(19),key.charAt(11),key.charAt(3)];
        

        
        let keyString = '';
        for(var i=0;i<Kplus.length;i++){
            keyString = keyString.concat(Kplus[i]);
        }

        // //console.log("generateKeys: key: ", key);
        // //console.log("generateKeys: Kplus: ", keyString);


        //  Need 16 pieces
        let cComplete = new Array(17).fill('');
        let dComplete = new Array(17).fill('');
        let C0 = keyString.substring(0, 28);
        let D0 = keyString.substring(28);
        // //console.log(C0.length - D0.length, " :Diff");
        // //console.log("C0 = " + C0 + " D0: " + D0 + "; Keystring: " + keyString);
        
        //Compute C0 -> C16 and D0 -> D16 by shifting
        cComplete[0] = C0;
        dComplete[0] = D0;
        for(var i=0;i<16;i++){
            if(i===0||i===1||i===8||i===15){
                cComplete[i+1] = this.stringShift(cComplete[i],1);
                dComplete[i+1] = this.stringShift(dComplete[i],1);
                // j = i+1;
                // //console.log("cComplete[" + i + "]: " + cComplete[i] + " | cComplete[" + j + "]: " + cComplete[i+1]);

            }
            else{
                cComplete[i+1] = this.stringShift(cComplete[i],2);
                dComplete[i+1] = this.stringShift(dComplete[i],2);
                // j = i + 1;
                // //console.log("cComplete[" + i + "]: " + cComplete[i] + " | cComplete[" + j + "]: " + cComplete[i+1]);

            }
        }

        globalVars.C = cComplete;
        globalVars.D = dComplete;

        // //console.log('cComplete: '+cComplete)
        // //console.log('dComplete: '+dComplete)
        // //console.log('C: '+globalVars.C);
        // //console.log('D: '+globalVars.D);
        //Make keys K1 -> K16
        let CDComplete = new Array(17).fill('');
        let cdString = '';

        for(var i=0;i<cComplete.length; i++){
            cdString = '';
            cdString = cdString.concat(cComplete[i]);
            cdString = cdString.concat(dComplete[i]);
            CDComplete[i] = cdString;
            
            //  //console.log("CDComplete[" + i + "]: " + CDComplete[i]);

        }
        // //console.log('CD Complete: '+CDComplete);

        //           PC-2
        // 14    17   11    24     1    5 //
        //  3    28   15     6    21   10 //
        // 23    19   12     4    26    8 //
        // 16     7   27    20    13    2 //
        // 41    52   31    37    47   55 //
        // 30    40   51    45    33   48 //
        // 44    49   39    56    34   53 //
        // 46    42   50    36    29   32 //

        let keyList = new Array(16).fill('');
        let Kstring = '';

        for(var i=0;i<keyList.length;i++){
            Kstring = '';
            let keyN = [
                CDComplete[i+1].charAt(13),CDComplete[i+1].charAt(16),CDComplete[i+1].charAt(10),
                CDComplete[i+1].charAt(23),CDComplete[i+1].charAt(0),CDComplete[i+1].charAt(4),
                CDComplete[i+1].charAt(2),CDComplete[i+1].charAt(27),CDComplete[i+1].charAt(14),
                CDComplete[i+1].charAt(5),CDComplete[i+1].charAt(20),CDComplete[i+1].charAt(9),
                CDComplete[i+1].charAt(22),CDComplete[i+1].charAt(18),CDComplete[i+1].charAt(11),
                CDComplete[i+1].charAt(3),CDComplete[i+1].charAt(25),CDComplete[i+1].charAt(7),
                CDComplete[i+1].charAt(15),CDComplete[i+1].charAt(6),CDComplete[i+1].charAt(26),
                CDComplete[i+1].charAt(19),CDComplete[i+1].charAt(12),CDComplete[i+1].charAt(1),
                CDComplete[i+1].charAt(40),CDComplete[i+1].charAt(51),CDComplete[i+1].charAt(30),
                CDComplete[i+1].charAt(36),CDComplete[i+1].charAt(46),CDComplete[i+1].charAt(54),
                CDComplete[i+1].charAt(29),CDComplete[i+1].charAt(39),CDComplete[i+1].charAt(50),
                CDComplete[i+1].charAt(44),CDComplete[i+1].charAt(32),CDComplete[i+1].charAt(47),
                CDComplete[i+1].charAt(43),CDComplete[i+1].charAt(48),CDComplete[i+1].charAt(38),
                CDComplete[i+1].charAt(55),CDComplete[i+1].charAt(33),CDComplete[i+1].charAt(52),
                CDComplete[i+1].charAt(45),CDComplete[i+1].charAt(41),CDComplete[i+1].charAt(49),
                CDComplete[i+1].charAt(35),CDComplete[i+1].charAt(28),CDComplete[i+1].charAt(31)
            ];
            for(var j=0;j<keyN.length;j++){
                Kstring = Kstring.concat(keyN[j]);
            }
            keyList[i] = Kstring;
            // //console.log('Key: ' + keyList[i], i, Kstring);
        }
        globalVars.Kn = keyList;
    }

    permuteMessage(message){
        //                      IP
        //     58    50   42    34    26   18    10    2 //
        //     60    52   44    36    28   20    12    4 //
        //     62    54   46    38    30   22    14    6 //
        //     64    56   48    40    32   24    16    8 //
        //     57    49   41    33    25   17     9    1 //
        //     59    51   43    35    27   19    11    3 //
        //     61    53   45    37    29   21    13    5 //
        //     63    55   47    39    31   23    15    7 //
        // //console.log("Message Permutation Start");
        // //console.log(this.state.binaryString);


        let permutedMessage = [
            message.charAt(57),message.charAt(49),message.charAt(41),message.charAt(33),
            message.charAt(25),message.charAt(17),message.charAt(9),message.charAt(1),
            message.charAt(59),message.charAt(51),message.charAt(43),message.charAt(35),
            message.charAt(27),message.charAt(19),message.charAt(11),message.charAt(3),
            message.charAt(61),message.charAt(53),message.charAt(45),message.charAt(37),
            message.charAt(29),message.charAt(21),message.charAt(13),message.charAt(5),
            message.charAt(63),message.charAt(55),message.charAt(47),message.charAt(39),
            message.charAt(31),message.charAt(23),message.charAt(15),message.charAt(7),
            message.charAt(56),message.charAt(48),message.charAt(40),message.charAt(32),
            message.charAt(24),message.charAt(16),message.charAt(8),message.charAt(0),
            message.charAt(58),message.charAt(50),message.charAt(42),message.charAt(34),
            message.charAt(26),message.charAt(18),message.charAt(10),message.charAt(2),
            message.charAt(60),message.charAt(52),message.charAt(44),message.charAt(36),
            message.charAt(28),message.charAt(20),message.charAt(12),message.charAt(4),
            message.charAt(62),message.charAt(54),message.charAt(46),message.charAt(38),
            message.charAt(30),message.charAt(22),message.charAt(14),message.charAt(6)
        ];

        let messageString = '';
        for(var j=0;j<permutedMessage.length;j++){
            messageString = messageString.concat(permutedMessage[j]);
        }

        // //console.log("Message: " + message);
        //console.log("permuted: " + messageString);

        this.getL0R0(messageString, 32);


    }


    //Generate all Ln and Rn for the algorithm
    desRounds(){

        let rVal = new Array(17).fill('');
        let lVal = new Array(17).fill('');

        // rVal[0] = globalVars.R;
        // lVal[0] = globalVars.L;
        let prevR = globalVars.R;

        let Lcur = globalVars.L;

        for(var z=0; z<16; z++){
            // //console.log("R, L: " + globalVars.R +' '+ globalVars.L);


            //let ERx = this.permuteR(globalVars.R);
            let ERx = this.permuteR(globalVars.R);


            ////console.log('Key: '+globalVars.Kn[z]);
            ////console.log('ERx: '+ERx)
            
            let KxERx = this.XOR(ERx,globalVars.Kn[z]);
            
            ////console.log('Xor Result: '+KxERx);

            let bArray = new Array(8).fill('');
            let start = 0;
            let end = 0;
            for(var i=0;i<bArray.length;i++){
                start = i*6;
                end = start+6;
                bArray[i] = KxERx.slice(start,end);
                // //console.log("[" + z + "]: bArray[" + i + "]: " + bArray[i]);
            }
            globalVars.B = bArray;

            // //console.log("[" + z + "] globalVars.B: " + globalVars.B);


            let s1 = new Array(4);
            let s2 = new Array(4);
            let s3 = new Array(4);
            let s4 = new Array(4);
            let s5 = new Array(4);
            let s6 = new Array(4);
            let s7 = new Array(4);
            let s8 = new Array(4);

            s1[0]=[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7];
            s1[1]=[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8];
            s1[2]=[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0];
            s1[3]=[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13];

            s2[0] = [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10];
            s2[1] = [3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5];
            s2[2] = [0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15];
            s2[3] = [13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9];
        
            s3[0] = [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8];
            s3[1] = [13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1];
            s3[2] = [13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7];
            s3[3] = [1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12];

            s4[0] = [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15];
            s4[1] = [13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9];
            s4[2] = [10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4];
            s4[3] = [3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14];

            s5[0] = [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9];
            s5[1] = [14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6];
            s5[2] = [4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14];
            s5[3] = [11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3];

            s6[0] = [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11];
            s6[1] = [10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8];
            s6[2] = [9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6];
            s6[3] = [4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13];

            s7[0] =  [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1];
            s7[1] = [13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6];
            s7[2] = [1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2];
            s7[3] = [6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12];

            s8[0] = [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7];
            s8[1] = [1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2];
            s8[2] = [7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8];
            s8[3] = [2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11];

            let sBoxes = [s1,s2,s3,s4,s5,s6,s7,s8];
            let sResult = '';
            let step = '';
            for(var i=0;i<globalVars.B.length;i++){
                // //console.log('B[' + i + ']: '+globalVars.B[i]);
                step = this.lookUp(globalVars.B[i],sBoxes[i]);
                // //console.log('Step: '+step);
                sResult = sResult.concat(step);
                // //console.log('StepResult: '+sResult);
            }
            // //console.log('Final String[' + z + ']: '+sResult);

            //Permute SBox Result
            // 16   7  20  21 //
            // 29  12  28  17 //
            //  1  15  23  26 //
            //  5  18  31  10 //
            //  2   8  24  14 //
            // 32  27   3   9 //
            // 19  13  30   6 //
            // 22  11   4  25 //

            let fResult = [
                sResult.charAt(15),sResult.charAt(6),sResult.charAt(19),sResult.charAt(20),
                sResult.charAt(28),sResult.charAt(11),sResult.charAt(27),sResult.charAt(16),
                sResult.charAt(0),sResult.charAt(14),sResult.charAt(22),sResult.charAt(25),
                sResult.charAt(4),sResult.charAt(17),sResult.charAt(30),sResult.charAt(9),
                sResult.charAt(1),sResult.charAt(7),sResult.charAt(23),sResult.charAt(13),
                sResult.charAt(31),sResult.charAt(26),sResult.charAt(2),sResult.charAt(8),
                sResult.charAt(18),sResult.charAt(12),sResult.charAt(29),sResult.charAt(5),
                sResult.charAt(21),sResult.charAt(10),sResult.charAt(3),sResult.charAt(24)
            ];

            let fString = '';
            for(var i=0;i<fResult.length;i++){
                fString = fString.concat(fResult[i]);
            }
            
            // //console.log("fString[" + z + "]: " + fString);

            prevR = globalVars.R

            // //console.log(`Fstring length: ${fString.length}, L length: ${globalVars.L.length}`);

            globalVars.R = this.XOR(fString, globalVars.L);
            // globalVars.R = this.XOR(fString, lVal[z]);
            // //console.log("XOR: " + fString + " " + globalVars.L + " " + globalVars.R);

            // //console.log('R[' + z + ']: '+globalVars.R);
            // //console.log('Lprev[' + z + ']: '+globalVars.L);

            ////console.log('R[' + z + ']: '+rVal[z]);
            ////console.log('L[' + z + ']: '+lVal[z]);


            // rVal[z+1] = globalVars.R;
            // lVal[z+1] = rVal[z];

            
            if ( z != 15 ) {
                // globalVars.L = globalVars.R;
                globalVars.L = prevR;
            }

            //console.log('Round ' + (z+1) + '   ' + globalVars.L + "  " + globalVars.R + "  " + fString);
            // //console.log('Round ' + (z+1) + '   ' +lVal[z] + "  " + rVal[z]);

            ////console.log("Step Complete!");
        }


        //console.log('End ' + globalVars.L + "  " + globalVars.R);


        //
        //  Reverse the two blocks to form the 64-bit block
        //

        let RLString = globalVars.R.concat(globalVars.L);
        //console.log("Rstring: " + RLString);

        //            Final Permutation
        // 40     8   48    16    56   24    64   32 //
        // 39     7   47    15    55   23    63   31 //
        // 38     6   46    14    54   22    62   30 //
        // 37     5   45    13    53   21    61   29 //
        // 36     4   44    12    52   20    60   28 //
        // 35     3   43    11    51   19    59   27 //
        // 34     2   42    10    50   18    58   26 //
        // 33     1   41     9    49   17    57   25 //
        let encryptedMessageArray = [
            RLString.charAt(39),RLString.charAt(7),RLString.charAt(47),RLString.charAt(15),
            RLString.charAt(55),RLString.charAt(23),RLString.charAt(63),RLString.charAt(31),
            RLString.charAt(38),RLString.charAt(6),RLString.charAt(46),RLString.charAt(14),
            RLString.charAt(54),RLString.charAt(22),RLString.charAt(62),RLString.charAt(30),
            RLString.charAt(37),RLString.charAt(5),RLString.charAt(45),RLString.charAt(13),
            RLString.charAt(53),RLString.charAt(21),RLString.charAt(61),RLString.charAt(29),
            RLString.charAt(36),RLString.charAt(4),RLString.charAt(44),RLString.charAt(12),
            RLString.charAt(52),RLString.charAt(20),RLString.charAt(60),RLString.charAt(28),
            RLString.charAt(35),RLString.charAt(3),RLString.charAt(43),RLString.charAt(11),
            RLString.charAt(51),RLString.charAt(19),RLString.charAt(59),RLString.charAt(27),
            RLString.charAt(34),RLString.charAt(2),RLString.charAt(42),RLString.charAt(10),
            RLString.charAt(50),RLString.charAt(18),RLString.charAt(58),RLString.charAt(26),
            RLString.charAt(33),RLString.charAt(1),RLString.charAt(41),RLString.charAt(9),
            RLString.charAt(49),RLString.charAt(17),RLString.charAt(57),RLString.charAt(25),
            RLString.charAt(32),RLString.charAt(0),RLString.charAt(40),RLString.charAt(8),
            RLString.charAt(48),RLString.charAt(16),RLString.charAt(56),RLString.charAt(24)
        ];
        let encryptedMessage = '';
        for(var i=0;i<encryptedMessageArray.length;i++){
            encryptedMessage = encryptedMessage.concat(encryptedMessageArray[i]);
        }
        //console.log("Encrypted Message: " + encryptedMessage);
        return encryptedMessage;
    }



    //send in Bi and SBoxi and return 4 bit binary result
    lookUp(x, arr){
        let col = 0;
        let row = 0;
        let bin = '';
        let res = 0;
        let fin = '';
        bin = x.charAt(0).concat(x.charAt(x.length-1));
        ////console.log(x, bin);
        col = parseInt(bin, 2);
        ////console.log('SBox Col: '+col);
        bin = x.slice(1,x.length-1);
        row = parseInt(bin, 2);
        ////console.log('Sbox Row: '+row);
        res = arr[col][row];
        ////console.log('SBox Result: '+res);
        fin = this.intTo4BitBinary(res);
        ////console.log('SBox fin: '+fin);

        // //console.log("Lookup: x: " + x + "; col: " + col + "; row: " + row + "; res: " + res + "; fin: " + fin);

        return fin;
    }
    //Convert int to 4 bit binary string: 1 -> 0001 and 15 -> 1111
    intTo4BitBinary(num){
        ////console.log('Num: '+num);
        let binString = num.toString(2);
        let zeroes = '';
        if(binString.length<4){
            let diff = 4 - binString.length;
            for(var i=0;i<diff;i++){
                zeroes = zeroes.concat('0');
            }
            binString = zeroes.concat(binString);
        }
        ////console.log('Binary of Num: '+ binString);
        return binString;
    }

    //XORs two inputs and returns a string of the result.
    XOR(x,y){
        let res = '';

        for(var i=0;i<x.length;i++){
            if(x.charAt(i)==='1'){
                if(y.charAt(i)==='1'){
                    res = res.concat('0');
                }
                else{
                    res = res.concat('1');
                }
            }
            else{
                if(y.charAt(i)==='1'){
                    res = res.concat('1');
                }
                else{
                    res = res.concat('0');
                }
            }
        }

        
        ////console.log(res);
        return res;
    }

    permuteR(Lx){
        //     E BIT-SELECTION TABLE
        // 32     1    2     3     4    5 //
        //  4     5    6     7     8    9 //
        //  8     9   10    11    12   13 //
        // 12    13   14    15    16   17 //
        // 16    17   18    19    20   21 //
        // 20    21   22    23    24   25 //
        // 24    25   26    27    28   29 //
        // 28    29   30    31    32    1

        let RnConstructor = [
            Lx.charAt(31),Lx.charAt(0),Lx.charAt(1),Lx.charAt(2),Lx.charAt(3),Lx.charAt(4),
            Lx.charAt(3),Lx.charAt(4),Lx.charAt(5),Lx.charAt(6),Lx.charAt(6),Lx.charAt(8),
            Lx.charAt(7),Lx.charAt(8),Lx.charAt(9),Lx.charAt(10),Lx.charAt(11),Lx.charAt(12),
            Lx.charAt(11),Lx.charAt(12),Lx.charAt(13),Lx.charAt(14),Lx.charAt(15),Lx.charAt(16),
            Lx.charAt(15),Lx.charAt(16),Lx.charAt(17),Lx.charAt(18),Lx.charAt(19),Lx.charAt(20),
            Lx.charAt(19),Lx.charAt(20),Lx.charAt(21),Lx.charAt(22),Lx.charAt(23),Lx.charAt(24),
            Lx.charAt(23),Lx.charAt(24),Lx.charAt(25),Lx.charAt(26),Lx.charAt(27),Lx.charAt(28),
            Lx.charAt(27),Lx.charAt(28),Lx.charAt(29),Lx.charAt(30),Lx.charAt(31),Lx.charAt(0)
        ];

        let Rn = '';
        for(var i=0;i<RnConstructor.length;i++){
            Rn = Rn.concat(RnConstructor[i]);
        }
        
        // //console.log("permuteR: Lx:" + Lx + "; Rn: " + Rn);

        return Rn;
    }

    //
    //  Shift the bits to the left
    //
    stringShift(str, amt){
        let shift = '';
        let finalstr = '';

        let tmpStr = str;

        // for (var j=0; j < amt; j++) {

        //     finalstr = tmpStr;

        //     let firstBit = str[0];

        //     for (var i = 1; i< str.length; i++ ) {
        //         finalstr[i-1] = str[i];
        //     }
        //     finalstr[str.length -1] = firstBit;
        // }


        // if(amt === 1){
        //     shift = str.substring(1);
        //     finalstr = str.concat(shift);
        // }
        // else{
        //     shift = str.substring(0, amt-1);
        //     finalstr = str.concat(shift);
        // }
        shift = str.substring(amt);
        let fbits = str.slice(0,amt);
        finalstr = shift.concat(fbits);

        return finalstr;
    }

    decDesRounds(){

        for(var z=15; z>-1; z--){
            // //console.log("R, L: " + globalVars.R +' '+ globalVars.L);

            let ERx = this.permuteR(globalVars.R);


            ////console.log('Key: '+globalVars.Kn[z]);
            ////console.log('ERx: '+ERx)
            
            let KxERx = this.XOR(ERx,globalVars.Kn[z]);
            
            ////console.log('Xor Result: '+KxERx);

            let bArray = new Array(8).fill('');
            let start = 0;
            let end = 0;
            for(var i=0;i<bArray.length;i++){
                start = i*6;
                end = start+6;
                bArray[i] = KxERx.slice(start,end);
                // //console.log("[" + z + "]: bArray[" + i + "]: " + bArray[i]);
            }
            globalVars.B = bArray;

            // //console.log("[" + z + "] globalVars.B: " + globalVars.B);


            let s1 = new Array(4);
            let s2 = new Array(4);
            let s3 = new Array(4);
            let s4 = new Array(4);
            let s5 = new Array(4);
            let s6 = new Array(4);
            let s7 = new Array(4);
            let s8 = new Array(4);

            s1[0]=[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7];
            s1[1]=[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8];
            s1[2]=[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0];
            s1[3]=[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13];

            s2[0] = [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10];
            s2[1] = [3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5];
            s2[2] = [0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15];
            s2[3] = [13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9];
        
            s3[0] = [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8];
            s3[1] = [13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1];
            s3[2] = [13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7];
            s3[3] = [1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12];

            s4[0] = [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15];
            s4[1] = [13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9];
            s4[2] = [10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4];
            s4[3] = [3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14];

            s5[0] = [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9];
            s5[1] = [14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6];
            s5[2] = [4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14];
            s5[3] = [11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3];

            s6[0] = [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11];
            s6[1] = [10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8];
            s6[2] = [9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6];
            s6[3] = [4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13];

            s7[0] =  [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1];
            s7[1] = [13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6];
            s7[2] = [1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2];
            s7[3] = [6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12];

            s8[0] = [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7];
            s8[1] = [1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2];
            s8[2] = [7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8];
            s8[3] = [2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11];

            let sBoxes = [s1,s2,s3,s4,s5,s6,s7,s8];
            let sResult = '';
            let step = '';
            for(var i=0;i<globalVars.B.length;i++){
                ////console.log('B[' + i + ']: '+globalVars.B[i]);
                step = this.lookUp(globalVars.B[i],sBoxes[i]);
                ////console.log('Step: '+step);
                sResult = sResult.concat(step);
                ////console.log('StepResult: '+sResult);
            }
            // //console.log('Final String[' + z + ']: '+sResult);

            //Permute SBox Result
            // 16   7  20  21 //
            // 29  12  28  17 //
            //  1  15  23  26 //
            //  5  18  31  10 //
            //  2   8  24  14 //
            // 32  27   3   9 //
            // 19  13  30   6 //
            // 22  11   4  25 //

            let fResult = [
                sResult.charAt(15),sResult.charAt(6),sResult.charAt(19),sResult.charAt(20),
                sResult.charAt(28),sResult.charAt(11),sResult.charAt(27),sResult.charAt(16),
                sResult.charAt(0),sResult.charAt(14),sResult.charAt(22),sResult.charAt(25),
                sResult.charAt(4),sResult.charAt(17),sResult.charAt(30),sResult.charAt(9),
                sResult.charAt(1),sResult.charAt(7),sResult.charAt(23),sResult.charAt(13),
                sResult.charAt(31),sResult.charAt(26),sResult.charAt(2),sResult.charAt(8),
                sResult.charAt(18),sResult.charAt(12),sResult.charAt(29),sResult.charAt(5),
                sResult.charAt(21),sResult.charAt(10),sResult.charAt(3),sResult.charAt(24)
            ];

            let fString = '';
            for(var i=0;i<fResult.length;i++){
                fString = fString.concat(fResult[i]);
            }
            
            ////console.log("fString[" + z + "]: " + fString);

            globalVars.R = this.XOR(fString, globalVars.L);
            ////console.log('R[' + z + ']: '+globalVars.R);
            ////console.log('Lprev[' + z + ']: '+globalVars.L);

          if ( z != 15 ) {
                globalVars.L = globalVars.R;
            }

            ////console.log("Step Complete!");
        }

        //
        //  Reverse the two blocks to form the 64-bit block
        //

        let RLString = globalVars.R.concat(globalVars.L);
        //console.log("Rstring: " + RLString);

        //            Final Permutation
        // 40     8   48    16    56   24    64   32 //
        // 39     7   47    15    55   23    63   31 //
        // 38     6   46    14    54   22    62   30 //
        // 37     5   45    13    53   21    61   29 //
        // 36     4   44    12    52   20    60   28 //
        // 35     3   43    11    51   19    59   27 //
        // 34     2   42    10    50   18    58   26 //
        // 33     1   41     9    49   17    57   25 //
        let encryptedMessageArray = [
            RLString.charAt(39),RLString.charAt(7),RLString.charAt(47),RLString.charAt(15),
            RLString.charAt(55),RLString.charAt(23),RLString.charAt(63),RLString.charAt(31),
            RLString.charAt(38),RLString.charAt(6),RLString.charAt(46),RLString.charAt(14),
            RLString.charAt(54),RLString.charAt(22),RLString.charAt(62),RLString.charAt(30),
            RLString.charAt(37),RLString.charAt(5),RLString.charAt(45),RLString.charAt(13),
            RLString.charAt(53),RLString.charAt(21),RLString.charAt(61),RLString.charAt(29),
            RLString.charAt(36),RLString.charAt(4),RLString.charAt(44),RLString.charAt(12),
            RLString.charAt(52),RLString.charAt(20),RLString.charAt(60),RLString.charAt(28),
            RLString.charAt(35),RLString.charAt(3),RLString.charAt(43),RLString.charAt(11),
            RLString.charAt(51),RLString.charAt(19),RLString.charAt(59),RLString.charAt(27),
            RLString.charAt(34),RLString.charAt(2),RLString.charAt(42),RLString.charAt(10),
            RLString.charAt(50),RLString.charAt(18),RLString.charAt(58),RLString.charAt(26),
            RLString.charAt(33),RLString.charAt(1),RLString.charAt(41),RLString.charAt(9),
            RLString.charAt(49),RLString.charAt(17),RLString.charAt(57),RLString.charAt(25),
            RLString.charAt(32),RLString.charAt(0),RLString.charAt(40),RLString.charAt(8),
            RLString.charAt(48),RLString.charAt(16),RLString.charAt(56),RLString.charAt(24)
        ];
        let encryptedMessage = '';
        for(var i=0;i<encryptedMessageArray.length;i++){
            encryptedMessage = encryptedMessage.concat(encryptedMessageArray[i]);
        }
        //console.log("Encrypted Message: " + encryptedMessage);
        return encryptedMessage;
    }

    Encrypt(){
        let encryptinput = this.state.stringInput;
        ////console.log(this.state.stringInput);

        let inputString = this.convertToBinary(encryptinput);

        ////console.log("inputString: " + inputString);

        this.setState({binaryInput: inputString});

        this.generateKeys(this.state.key);
        this.permuteMessage(inputString);

        let fin = this.desRounds();

        this.setState({encMess: fin});

        this.setState({direction: !this.state.direction});
    }

    Decrypt(){

        let decryptinput = this.state.encMess;
        ////console.log('Decrypt: '+decryptinput);

        this.setState({binaryInput: decryptinput});

        this.permuteMessage(decryptinput);

        let dec = this.decDesRounds();

        //console.log('dec: '+dec);

//        let fin = this.convertBinaryToString(dec);
        let fin = dec;
        ////console.log('fin: '+ fin);

        this.setState({encMess: fin});

        this.setState({direction: !this.state.direction});
    }

    convertBinaryToString(bin){
        let binArray = bin.match(/.{1,8}/g);
        ////console.log('BinArray: '+binArray);
        let res = '';
        let num = 0;
        let numStr = '';
        let letter = '';
        for(var i=0;i<binArray.length;i++){
            letter = binArray[i];
            ////console.log('letter: '+ letter);
            num = parseInt(letter, 2);
            ////console.log('Num: '+num);
            numStr = String.fromCharCode(num);
            ////console.log('NumString: '+numStr);
            res+=numStr;
            ////console.log('Result: '+res);
        }
        return res;
    }

    getL0R0(str, index){
        ////console.log('String: '+str);
         let Lx = str.substring(0, index);
         //console.log('Lx: '+Lx);
         let Rx = str.substring(index);
         //console.log('Rx: '+Rx);
         globalVars.L = Lx;
         globalVars.R = Rx;
      }

      decGetL0R0(str,index){
        ////console.log('String: '+str);
        let Rx = str.substring(0, index);
        ////console.log('DECRYPTION Rx: '+Rx);
        let Lx = str.substring(index);
        ////console.log('DECRYPTION Lx: '+Lx);
        globalVars.L = Lx;
        globalVars.R = Rx;
      }

      confirmKey(input){
        this.setState({errorMessage: false});
            if(input === ''){
                this.setState({key: this.state.defaultKey});
            }
          else if(input.length===64){
            this.setState({key: input});
          }
          else if(input.length<64){
              let diff = 64 - input.length;
              ////console.log(input.length);
              ////console.log('Diff: '+diff);
              let fillerString = new String('0').repeat(diff+1);
              ////console.log('Filler String: '+fillerString);
              let extend = input.concat(fillerString);
              ////console.log(extend);
              this.setState({key: extend});
          }
          else{
            this.setState({errorMessage: true});
          }
      }

      displayError(message){
          return(
          <h1 style={{color: 'red'}}>{message}</h1>
          );
      }

    entryBox(input){
        return ( 
           <div>
           <input type="text" name='textIn' onChange={this.handleChange}/>
           <button onClick={this.handleClick}>Confirm</button>
           <p> {this.state.stringInput} </p>
           <p>Input in Binary: {this.state.binaryInput}</p>
           </div>
         );
    }

    keyEntryBox(){
        return ( 
            <div>
            <div style={{display: "flex", flexDirection: "row", margin: "3px"}}>
            <input type="text" name='keyIn' onChange={this.handleChange}/>
            <button onClick={()=>{this.confirmKey(this.state.keyIn)}}>{this.state.keyIn==='' ? 'Default key' : 'Confirm Key'}</button>
            <p>Key Length: {this.state.keyIn.length}</p>
            </div>
            <div>{this.state.errorMessage ? this.displayError('Key is too long!') : ''}</div>
            <p>Key in Binary: {this.state.key}</p>
            </div>
          );
    }

    displayKeys(){
        return(
            <div>
                <button onClick={()=>{this.generateKeys(this.state.key)}}>generate keys</button>

                <div>
                {globalVars.Kn ? 
                <div>
                    <p>Kn[0]: {globalVars.Kn[0]}</p>
                    <p>Kn[1]: {globalVars.Kn[1]}</p>
                    <p>Kn[2]: {globalVars.Kn[2]}</p>
                    <p>Kn[3]: {globalVars.Kn[3]}</p>
                    <p>Kn[4]: {globalVars.Kn[4]}</p>
                    <p>Kn[5]: {globalVars.Kn[5]}</p>
                    <p>Kn[6]: {globalVars.Kn[6]}</p>
                    <p>Kn[7]: {globalVars.Kn[7]}</p>
                    <p>Kn[8]: {globalVars.Kn[8]}</p>
                    <p>Kn[9]: {globalVars.Kn[9]}</p>
                    <p>Kn[10]: {globalVars.Kn[10]}</p>
                    <p>Kn[11]: {globalVars.Kn[11]}</p>
                    <p>Kn[12]: {globalVars.Kn[12]}</p>
                    <p>Kn[13]: {globalVars.Kn[13]}</p>
                    <p>Kn[14]: {globalVars.Kn[14]}</p>
                    <p>Kn[15]: {globalVars.Kn[15]}</p>

                </div>

                : ''
                }
                </div>

            </div>
        );
    }
    
    render() { 
        return ( 
            <div>
            <div>{this.entryBox(true)}</div>
            <div>{this.keyEntryBox()}</div>
            <div>
               {this.state.direction ? <button onClick={()=>{this.Encrypt()}}>Encrypt</button> : <button onClick={()=>{this.Decrypt()}}>Decrypt</button>}
           </div>

           <h1>
               {this.state.direction ? `Decrypted Message: ${this.state.encMess}` : `Encrypted Message: ${this.state.encMess}`}
           </h1>

            <div>
            <p>The Generated Keys</p>
            {globalVars.Kn ? 
            <div>
                <p>Kn[0]: {globalVars.Kn[0]}</p>
                <p>Kn[1]: {globalVars.Kn[1]}</p>
                <p>Kn[2]: {globalVars.Kn[2]}</p>
                <p>Kn[3]: {globalVars.Kn[3]}</p>
                <p>Kn[4]: {globalVars.Kn[4]}</p>
                <p>Kn[5]: {globalVars.Kn[5]}</p>
                <p>Kn[6]: {globalVars.Kn[6]}</p>
                <p>Kn[7]: {globalVars.Kn[7]}</p>
                <p>Kn[8]: {globalVars.Kn[8]}</p>
                <p>Kn[9]: {globalVars.Kn[9]}</p>
                <p>Kn[10]: {globalVars.Kn[10]}</p>
                <p>Kn[11]: {globalVars.Kn[11]}</p>
                <p>Kn[12]: {globalVars.Kn[12]}</p>
                <p>Kn[13]: {globalVars.Kn[13]}</p>
                <p>Kn[14]: {globalVars.Kn[14]}</p>
                <p>Kn[15]: {globalVars.Kn[15]}</p>

            </div>

            : ''
            }
            </div>

            </div>

         );
    }
}
 
export default DESCompiler;