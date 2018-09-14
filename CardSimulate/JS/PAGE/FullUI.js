/**
 * Created by lz on 2018/9/12.
 */
//在这里详细设定全屏等级的UI效果
function MakeFullUI()
{
    var advancedTexture = MyGame.fsUI;
    var UiPanel = new BABYLON.GUI.StackPanel();
    UiPanel.width = "220px";
    UiPanel.fontSize = "14px";
    UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    UiPanel.color = "white";
    advancedTexture.addControl(UiPanel);
    // ..
    var button1 = BABYLON.GUI.Button.CreateSimpleButton("button1", "向上两行");
    button1.paddingTop = "10px";
    button1.width = "100px";
    button1.height = "50px";
    button1.background = "green";
    button1.isVisible=false;
    button1.onPointerDownObservable.add(function(state,info,coordinates) {
        if(MyGame.init_state==1)//如果完成了场景的虚拟化
        {
            ScrollUporDown(0,1.8,2);
        }
    });
    UiPanel.addControl(button1);
    UiPanel.button1=button1;
    var button2 = BABYLON.GUI.Button.CreateSimpleButton("button2", "向下两行");
    button2.paddingTop = "10px";
    button2.width = "100px";
    button2.height = "50px";
    button2.background = "green";
    button2.isVisible=false;
    button2.onPointerDownObservable.add(function(state,info,coordinates) {
        if(MyGame.init_state==1)//如果完成了场景的虚拟化
        {
            ScrollUporDown(1,1.8,2);
        }
    });
    UiPanel.addControl(button2);
    UiPanel.button2=button2;
    MyGame.UiPanelr=UiPanel;
}