/**
 * Created by Vova on 22.10.2016.
 */
class Model {
    constructor(storage) {
        this.storage = storage;
    }

    create(title, callbacks) {
        title = title || '';

        let newItem = {
            title: title.trim()
        };

        this.storage.save(newItem, callbacks);
    }

    read(id, callback) {
        if (typeof id === 'function') {
            this.storage.findAll(id);
        }else {
            this.storage.find(id,callback);
        }
    }
    findNotesByTag(tag, callbaack){
        this.storage.findNotesByTag(tag, callbaack);
    }
    update(id,title,hashtags, callback){
        this.storage.update(id,title,hashtags,callback);
    }

    remove(id, callbacks) {
        this.storage.remove(id, callbacks);
    }
}