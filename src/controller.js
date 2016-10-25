/**
 * Created by Vova on 21.10.2016.
 */
'use strict';

class Controller {

    /**
     * @param {object}
     * */
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bind('newNote', item=>this.addItem(item));
        this.view.bind('removeNote', item=>this.removeItem(item.id));
        this.view.bind('editItem', item=>this.editItem(item.id));
        this.view.bind('editItemSave', data=>this.editItemSave(data.id,data.title,data.hashtags));
        this.view.bind('filterByHashtag', data=>this.showByHashtag(data.tag));

    }

    addItem(title) {
        this.model.create(title, ()=> {
            //callbacks
            // console.log(111);
            this.view.render('clearNewNote');
            this.rerender()
        });
    }

    removeItem(id) {
        console.log(id);
        this.model.remove(id, ()=> {
            this.view.render('removeNote', id);
            this.rerender();
        })
    }
    editItem(id){
        this.model.read(id, data=>{
            let title=data.title;
            this.view.render('editNote',{id,title});
        })
    }
    editItemSave(id,title,hashtags){
        this.model.update(id,title,hashtags, ()=>{
            this.view.render('editNoteSave',{id,title});
            this.rerender();
        })
    }

    show() {
        // console.log('bbb');
        this.model.read(data=>this.view.render("showAllNotes", data));
    }

    showByHashtag(tag){
        this.model.findNotesByTag(tag,data=>this.view.render("showAllNotes",data));
    }

    rerender(force) {
        // console.log('bbb');

        this.show();
    }

}