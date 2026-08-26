import { IContainerConfig } from "./Bag/Interface/IContainerConfig";
import { Container } from "./Bag/Model/Container";
import { ContainerRegistry } from "./Bag/Model/ContainerRegistry";
import { ContainerType } from "./Bag/Model/ContainerType";
import { BagTestData } from "./Bag/Test/BagTestData";

const { regClass, property } = Laya;

@regClass()
export class Main extends Laya.Script {

    onStart() {
        BagTestData.install();
        const containerCfg = BagTestData.instance.getContainerCfg(1001);
        const container = new Container(1001, containerCfg);
        ContainerRegistry.instance.register(container);
    }


}