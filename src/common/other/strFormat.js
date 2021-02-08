 //数据格式化处理
 export function dataFormat(str) {
     let textIndentNum = 0; //需要缩进的符号数量，为{和[符号数量,}和]符号数量之差
     let annotation = false; //标识当前code是否是注释，系统内注释符号只有'//'
     let detailValue = str;
     //先删除数据里面的空格和tab(包括中文和英文的），后续由格式化自动产生
     detailValue = detailValue.replaceAll(" ", "");
     detailValue = detailValue.replaceAll("	", "");

     //产生新的格式化数据
     detailValue = " " + detailValue;
     let newValue = detailValue[0];
     //从一开始，到最后一个直接结束是为了减少循环内部的越界判断
     let detailValueLength = detailValue.length - 1;
     for (let i = 1; i < detailValueLength; i++) {
         let code = detailValue[i];
         let nextCode = detailValue[i + 1];
         let lastCodeOfNewValueIndex = newValue.length - 1;
         let lastCodeOfNewValue = newValue[lastCodeOfNewValueIndex]; //新数据的最后一个字符

         //先判断内容是否是注释，如果是注释内容不做任何格式化处理
         if (code == "/" && nextCode == "/" && !annotation) {
             annotation = true;
             //如果注释前无空格，在注释前加一个空格将数据分隔开
             if (lastCodeOfNewValue != "") {
                 newValue += " ";
             }
         }
         //如果遇到回车，则注释结束
         if (code == "\n" && annotation) {
             annotation = false;
         }
         //如果是在注释部分，直接复制其内容
         if (annotation) {
             newValue += code;
         }
         //如果是正文，开启格式化处理
         else {
             //如果连续多个回车键，则仅保留一个，并处理下一行数据前的缩进
             if (code == "\n") {
                 if (lastCodeOfNewValue != "\n") {
                     newValue += code;
                     //如果下一个字符是普通字符，输入之前先进行缩进
                     if (
                         nextCode != "\n" &&
                         nextCode != "{" &&
                         nextCode != "[" &&
                         nextCode != "}" &&
                         nextCode != "]"
                     ) {
                         for (let j = 0; j < textIndentNum; j++) {
                             newValue += "  "; //每次缩进两字符
                         }
                     }
                 }
             } else if (code == "{" || code == "[") {
                 //如果格式化数据中最后一个不是换行符，先进行换行
                 if (lastCodeOfNewValue != "\n") {
                     newValue += "\n";
                 }
                 //采用空格进行缩进
                 for (let j = 0; j < textIndentNum; j++) {
                     newValue += "  "; //每次缩进两字符
                 }
                 newValue += code;

                 textIndentNum++;
                 newValue = procssNextLineIndex(
                     nextCode,
                     newValue,
                     textIndentNum
                 );
             } else if (code == "}" || code == "]") {
                 textIndentNum = textIndentNum > 0 ? textIndentNum - 1 : 0;
                 //如果格式化数据最后一个字符不是换行，先换行
                 if (lastCodeOfNewValue != "\n") {
                     newValue += "\n";
                 }
                 //进行数据缩进
                 for (let j = 0; j < textIndentNum; j++) {
                     newValue += "  "; //每次缩进两字符
                 }
                 newValue += code;
                 //如果下一个是，直接处理该字符，跳过下一个循环
                 if (nextCode == "," || nextCode == "，") {
                     newValue += nextCode;
                     i++;
                     nextCode = detailValue[i + 1];
                 }
                 newValue = procssNextLineIndex(
                     nextCode,
                     newValue,
                     textIndentNum
                 );
             } else {
                 newValue += code;
             }
         }
     }
     newValue += detailValue[detailValueLength];
     newValue = newValue.substring(1); //剪掉之前加的第一个字符
     if (newValue[0] == "\n") {
         newValue = newValue.substring(1);
     }
     return newValue;
 }

 //处理{[}]等符号后下一行缩进，及换行符后的缩进如果下一个字符是普通字符，输入之前先进行缩进
 function procssNextLineIndex(nextCode, newValue, textIndentNum) {
     if (
         nextCode != "\n" &&
         nextCode != "{" &&
         nextCode != "[" &&
         nextCode != "}" &&
         nextCode != "]"
     ) {
         newValue += "\n";
         for (let j = 0; j < textIndentNum; j++) {
             newValue += "  "; //每次缩进两字符
         }
     }
     return newValue;
 }