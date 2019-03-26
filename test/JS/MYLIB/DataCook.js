/**
 * Created by Administrator on 2015/7/1.
 */
//对数据（主要是二维数组结构）进行处理
var dc1=
{
    /**
     * 根据数据的指定列进行分组和合计，这个函数只支持已经完成排序并且只有一个排序列的简单情况
     * @param obj 需要进行处理的数据，该方法会对数据本身进行修改！
     * @param colnum 指定要进行分组的列，0表示第一列
     * @param rownum 指定从第几行开始进行处理，0表示第一行，在现有环境下一般为4
     * @param sumcol 一个枚举数组，表示对哪些列进行合计
     * 20161021修改：不改变原始数据
     * 可选择是否只显示汇总行，使用多个分组列，可以选择显示哪些列
     * */
    GroupSum:function(obj,colnum,rownum,sumcol)
    {
        var dataObjx=[];//将处理的数据暂时放在这个数组里
        //var dataObjx2=[];//将组合计放在这里，要把它返回去！，不要交叉调用数据！！
        var colstr=obj[rownum][colnum];//分组列的字符变化,初始值
        for(var i=0;i<rownum;i++)//把最前面的数据原样推入
        {
            dataObjx.push(obj[i]);
        }
        dataObjx.push(obj[rownum]);
        var rowCount=1;//记录这个组里有几行
        //var groupCount=1;//记录这个数据对象里有几个组
        var alldatasum=[];//总合计列
        for(var j=0;j<obj[rownum].length;j++)//首先构造一个总合计行
        {
            alldatasum[0]="总合计";
            for(var l=0;l<=sumcol.length;l++)//在合计列数组中寻找这一列
            {
                if(sumcol[l]==j)//如果这个列是合计列
                {
                    alldatasum[j]=0;
                    break;
                }
                if(l==sumcol.length)
                {
                    alldatasum[j]="";
                    break;
                }
            }
        }
        for(var i=rownum+1;i<=obj.length;i++)//为各个组添加合计行
        {
            if(i==obj.length||obj[i][colnum]!=colstr)//遍历到头或者进入了一个新的组，如果到头判断后一个条件会报错，所以把到头的条件放在前面
            {
                if(rowCount==1)//上一个组只有一行，不插入小计行，但是总合计里需要有这一行的数！
                {
                    for(var j=0;j<sumcol.length;j++)
                    {
                        alldatasum[sumcol[j]]+=(isNaN(parseInt(obj[i-1][sumcol[j]]))?0:parseInt(obj[i-1][sumcol[j]]));
                    }
                    if(i!=obj.length)//进入了新的一组
                    {
                        dataObjx.push(obj[i]);//把这个新行插入数组
                        colstr = obj[i][colnum];//更改分组列字符
                        continue;
                    }
                    else//到头了，不需要小计行
                    {
                        break;
                    }
                }
                else
                {
                    if(rowCount>1) //上一个组有多行，需要插入合计行，并把rowCount清空
                    {
                        var datarow=[];//合计行
                        for(var j=i-rowCount;j<i;j++)//遍历上一组的所有行，计算合计行
                        {
                            if(j==i-rowCount)//第一行，建立合计行
                            {
                                for(var k=0;k<obj[rownum].length;k++)//遍历这一行中的每一个列
                                {
                                    if(k==0)
                                    {
                                        datarow.push("小计");
                                    }
                                    else
                                    {
                                        for(var l=0;l<=sumcol.length;l++)//检查这一列是否需要合计， 这样的话sumcol可以不要求顺序！
                                        {
                                            if(sumcol[l]==k)//如果这个列是合计列
                                            {
                                                datarow.push(isNaN(parseInt(obj[j][k]))?0:parseInt(obj[j][k]));
                                                break;
                                            }
                                            if(l==sumcol.length)
                                            {
                                                datarow.push("");
                                                break;
                                            }
                                        }
                                    }
                                }
                                /*for (var k = 0; k < sumcol.length; k++)//对于每一个合计列
                                {
                                    datarow.push(parseInt(obj[j][sumcol[k]]));
                                }*/
                            }
                            else//后面的行，和第一行累加
                            {
                                for(var k=0;k<obj[rownum].length;k++)//遍历这一行中的每一个列
                                {
                                    if(k>0)
                                    {
                                        for(var l=0;l<sumcol.length;l++)//检查这一列是否需要合计
                                        {
                                            if(sumcol[l]==k)//如果这个列是合计列
                                            {
                                                datarow[k]+=(isNaN(parseInt(obj[j][k]))?0:parseInt(obj[j][k]));
                                                break;
                                            }
                                        }
                                    }
                                }
                                /*for (var k = 0; k < sumcol.length; k++)//对于每一个合计列
                                {
                                    datarow[sumcol[k]]+=parseInt(obj[j][sumcol[k]]);
                                }*/
                            }
                        }
                        dataObjx.push(datarow);//将生成的合计行插入
                        if(i!=obj.length)
                        {
                            rowCount = 1;//进入了一个新的组
                            dataObjx.push(obj[i]);//把这个新行插入数组
                            colstr = obj[i][colnum];//更改分组列字符
                            continue;
                        }
                        else
                        {
                            break;
                        }
                    }
                }
            }
            else if(obj[i][colnum]==colstr)//如果还在上一个组内
            {
                dataObjx.push(obj[i]);//把这个新行插入数组
                rowCount++;
                continue;
            }
        }

        for(var i=0;i<dataObjx.length;i++)//再计算总合计值
        {
            if(dataObjx[i][0]=="小计")
            {
                for(var j=0;j<sumcol.length;j++)
                {
                    alldatasum[sumcol[j]]+=(isNaN(parseInt(dataObjx[i][sumcol[j]]))?0:parseInt(dataObjx[i][sumcol[j]]));
                }
            }
        }
        dataObjx.push(alldatasum);
        //obj=dataObjx;
        //dataObjx=null;
        return dataObjx;
    },
    //不显示非汇总数据！！
//obj源数据
//arr_grocol需要分组的列
//rownum从第几行开始计算
//arr_sumcol需要汇总的列
//arr_display需要显示的列
    GroupSum2:function(obj,rownum,arr_grocol,arr_sumcol,arr_display)
    {
        var dataObjx = [];//将处理的数据暂时放在这个数组里
        //var colstr = obj[rownum][colnum];//分组列的字符变化,初始值
        for (var i = 0; i < rownum; i++)//把最前面的数据原样推入
        {
            dataObjx.push(obj[i]);
        }

        var len_display = arr_display.length;
        var len_sumcol = arr_sumcol.length;
        var len_grocol = arr_grocol.length;
        var len_obj = obj.length;

        dataObjx.push(obj[rownum]);//这时还要保持数据的完整性
        //var rowCount = 1;//记录这个组里有几行

        var alldatasum = [];//总合计行
        for (var j = 0; j < len_obj; j++)//首先构造一个总合计行
        {
            //alldatasum[0] = "总合计";
            for (var l = 0; l <= len_sumcol; l++)//在合计列数组中寻找这一列
            {
                if (arr_sumcol[l] == j)//如果这个列是合计列
                {
                    alldatasum[j] = 0;
                    break;
                }
                if (l == arr_sumcol.length) {
                    alldatasum[j] = "";
                    break;
                }
            }
        }


        for(var i=rownum+1;i<len_obj;i++)//为各个组建立合计行，这里的数据可能是没有排好序的！！
        {//对后面找到的每一条数据来说
            var flag_found=1;//表示找到了同组的数据，
            //var len_data=dataObjx.length;
            for(var j=rownum;j<dataObjx.length;j++)
            {//对于每个已经确定的组
                flag_found=1;
                for(var k=0;k<len_grocol;k++)
                {
                    if(dataObjx[j][arr_grocol[k]]!=obj[i][arr_grocol[k]])
                    {//发现了一个分组项不匹配
                        flag_found=0;
                        break;
                    }
                }
                if(flag_found==1)//找到了一组分组项完全匹配的
                {
                    for(var l=0;l<len_sumcol;l++)//对于每一个分组项相加
                    {
                        var reg=/[\d\.]+/;
                        var reg2=/[^\d\.]+/;
                        dataObjx[j][arr_sumcol[l]]=add(parseFloat(dataObjx[j][arr_sumcol[l]]),parseFloat(reg.exec(obj[i][arr_sumcol[l]])))+reg2.exec(obj[i][arr_sumcol[l]])+"";
                    }
                    break;
                }
            }
            if(flag_found==0)//遍历了所有组之后仍然没有找到符合的组
            {
                dataObjx.push(obj[i]);
            }
        }
        //在对所有数据遍历后
        //先汇总
        var len_data=dataObjx.length;
        for(var i=rownum;i<len_data;i++)
        {
            for(var j=0;j<len_sumcol;j++)
            {//对汇总行进行加和
                var reg=/[\d\.]+/;
                alldatasum[arr_sumcol[j]]=add(parseFloat(alldatasum[arr_sumcol[j]]),parseFloat(reg.exec(dataObjx[i][arr_sumcol[j]])))+"";//+reg2.exec(dataObjx[i][len_sumcol[j]]);
            }
        }
        dataObjx.push(alldatasum);
        //再投影
        var dataObjx2=[];
        var len_data=dataObjx.length;
        for(var i=0;i<len_data;i++)
        {//对于每一行数据
            var arr=[];
            if(i==1)
            {
                arr.push("序号");
            }
            else if(i==2)
            {
                arr.push("str");
            }
            else if(i==3)
            {
                arr.push(50);
            }
            else if(i==(len_data-1))
            {
                arr.push("合计");
            }
            else if(i>3)
            {
                arr.push(i-3);
            }
            for(var j=0;j<len_display;j++)
            {//投影出最终的数据行
                arr.push(dataObjx[i][arr_display[j]]);
            }
            dataObjx2.push(arr);
        }
        return dataObjx2;
    },
    //arr_by按这些列排序
    //desc为0表示由小到大排序
    //rownum表示从哪一行开始
    //rownum2后面有几行不参加排序（1个合计行）
    //withindex为1表示有原始序号，需要再次写序号
    OrderBy:function (obj,rownum,rownum2,arr_by,desc,withindex)
    {
        var dataObjx = [];
        var len_obj=obj.length;
        if(len_obj<1)
        {
            return [];
        }
        var len_by=arr_by.length;
        for(var i=0;i<rownum;i++)
        {
            dataObjx.push(obj[i]);
        }
        dataObjx.push(obj[rownum]);
        for(var i=rownum+1;i<len_obj-rownum2;i++)//对于后面的每一行数据
        {
            var flag="smaller";
            for(var j=rownum;j<dataObjx.length;j++)//与已有数据做比较，认为已有数据是已经排序完毕的！！
            {
                flag="smaller";//表示新来的数据比正在被比较的已有数据小
                for(var k=0;k<len_by;k++)//顺序考虑每一个排序条件
                {
                    if(desc==0)//从小到大排序，也就是从最小的比起了，拿出最小的已有数据和新来的数据比
                    {
                        if(dataObjx[j][arr_by[k]]>obj[i][arr_by[k]])//只要有一个优先排序条件比已有数据小
                        {//那么就是确实比该元素小
                            flag="smaller";
                            break;
                        }
                        else if(dataObjx[j][arr_by[k]]==obj[i][arr_by[k]])//相等则考虑下一排序条件
                        {//如果全部一样则会被认为是smaller而插入
                            continue;
                        }
                        else//优先排序条件比已有数据大
                        {
                            flag="bigger";
                            break;
                        }
                    }
                    else if(desc==1)//由大到小时应该是对称的吧
                    {
                        if(dataObjx[j][arr_by[k]]<obj[i][arr_by[k]])//只要有一个优先排序条件比已有数据小
                        {//那么就是确实比该元素小
                            flag="smaller";
                            break;
                        }
                        else if(dataObjx[j][arr_by[k]]==obj[i][arr_by[k]])//相等则考虑下一排序条件
                        {//如果全部一样则会被认为是smaller而插入
                            continue;
                        }
                        else//优先排序条件比已有数据大
                        {
                            flag="bigger";
                            break;
                        }
                    }
                }
                if(flag=="smaller")
                {
                    dataObjx.splice(j,0,obj[i]);
                    break;//跳出循环开始考虑下一条数据
                }
                else if(flag=="bigger")//拿下一条更大一点的数据来比较
                {
                    continue;
                }
            }
            if(flag=="bigger")//这一条是目前为止最大的
            {
                dataObjx.push(obj[i]);
            }
        }
        for(var i=len_obj-rownum2;i<len_obj;i++)
        {
            dataObjx.push(obj[i]);
        }
        if(withindex==1)//重写序号
        {
            var len=dataObjx.length;
            for(var i=rownum;i<len-rownum2;i++)
            {
                dataObjx[i][0]=i-rownum+1;
            }
        }
        return dataObjx;
    }
}