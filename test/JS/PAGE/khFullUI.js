/**
 * Created by lz on 2018/9/12.
 */
//在这里详细设定全屏等级的UI效果
function MakeFullUI()
{
    var advancedTexture = MyGame.fsUI;
    //手牌阶段的UI
    if(true)
    {
        var UiPanel = new BABYLON.GUI.StackPanel();
        UiPanel.width = "220px";
        UiPanel.fontSize = "14px";
        UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        UiPanel.color = "white";
        advancedTexture.addControl(UiPanel);
        // ..
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("button1", "投入");
        button1.paddingTop = "10px";
        button1.width = "100px";
        button1.height = "50px";
        button1.background = "green";
        button1.isVisible=false;
        button1.onPointerDownObservable.add(function(state,info,coordinates) {
            if(MyGame.init_state==1)//如果完成了场景的虚拟化
            {
                //ScrollUporDown(0,1.8,2);
            }
        });
        UiPanel.addControl(button1);
        UiPanel.buttonup=button1;
        var button2 = BABYLON.GUI.Button.CreateSimpleButton("button2", "高速投入");
        button2.paddingTop = "10px";
        button2.width = "100px";
        button2.height = "50px";
        button2.background = "green";
        button2.isVisible=false;
        button2.onPointerDownObservable.add(function(state,info,coordinates) {
            if(MyGame.init_state==1)//如果完成了场景的虚拟化
            {
                //ScrollUporDown(1,1.8,2);
            }
        });
        UiPanel.addControl(button2);
        UiPanel.buttondown=button2;

        var UiPanel2 = new BABYLON.GUI.StackPanel();
        UiPanel2.width = "220px";
        UiPanel2.fontSize = "14px";
        UiPanel2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        UiPanel2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        UiPanel2.color = "white";
        advancedTexture.addControl(UiPanel2);
        var button3 = BABYLON.GUI.Button.CreateSimpleButton("button3", "轻放");
        button3.paddingTop = "10px";
        button3.width = "100px";
        button3.height = "50px";
        button3.background = "green";
        button3.isVisible=false;
        button3.onPointerDownObservable.add(function(state,info,coordinates) {
            if(MyGame.init_state==1&&card_Closed&&card_Closed.workstate!="dust")//如果完成了场景的虚拟化
            {
                //Card2Chess();//将当前选中的手牌和光标关联起来，换回first_lock，并改变光标的颜色，点击空白地块时落下棋子，
            }
        });
        UiPanel2.addControl(button3);
        UiPanel2.buttonc2c=button3;
        var button4 = BABYLON.GUI.Button.CreateSimpleButton("button4", "精细操作");
        button4.paddingTop = "10px";
        button4.width = "100px";
        button4.height = "50px";
        button4.background = "green";
        button4.isVisible=false;
        button4.onPointerDownObservable.add(function(state,info,coordinates) {
            if(MyGame.init_state==1)//如果完成了场景的虚拟化
            {
                //NextRound();//所有棋子的状态变为wait，特殊状态的除外
            }
        });
        UiPanel2.addControl(button4);
        UiPanel2.buttonnextr=button4;
        MyGame.UiPanelr=UiPanel;
        MyGame.UiPanell=UiPanel2;
    }
}
