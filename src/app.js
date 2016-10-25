/**
 * Created by Vova on 21.10.2016.
 */

class App {

    constructor(name) {
        this.storage=new Store(name);
        // this.storage.createFirst(1);
        this.model=new Model(this.storage);
        this.view=new View();
        this.controller= new Controller(this.model, this.view);
    }

}

window.onload = ()=> {
    todo = new App('application');
    console.log(3);
};
