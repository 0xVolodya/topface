let getTitle = ()=> {
    let edit = document.querySelector('.edit');
    let value = null;
    if (edit) {
        value = edit.innerHTML;
    }
    return value;
};


let _getNoteId = (element) => {
    return parseInt($parent(element, 'li').dataset.id, 10);
    // console.log($parent(element, 'li').dataset.id);

};

let _getHashtags = () => {
    let title = getTitle();
    console.log(getTitle());
    let hashArray;
    if (title.match(/(#[a-z\d-]+)/ig) != null) {
        hashArray = title.match(/(#[a-z\d-]+)/ig);
    } else {
        hashArray = [];
    }
    console.log(hashArray);
    return hashArray;
};


/*
 let _getNoteTitle = (element) => {
 console.log($parent(element, 'li'));
 return $parent(element, 'li').dataset.title;

 };*/


class View {
    constructor() {
        this.defaultTemplate =
            `<li class=" static list-group-item clearfix " data-id="{{id}}">   
            <div class="view">
                <p>{{title}}</p>
            </div>
           
            <ul class="buttons btn-group">
            <button class="btn btn-danger removeNote">Delete</button>
            <button class="btn btn-success saveNote">Save</button>
            <button class="btn btn-primary editNote">Edit</button>
            </ul>
            <ul class="hastags">{{hashtags}}</ul>
            
        </li>`;

        this.$newNote = document.querySelector(".new-note");
        this.$notesList = document.querySelector(".note-list");
        // this.$hashtagList = document.querySelector(".hastags");

        this.commands = {
            "clearNewNote": parameter=> this.$newNote.value = "",
            "showAllNotes": parameter=> this.$notesList.innerHTML = this.spliceStore(parameter),
            "removeNote": parameter=> this.removeItem(parameter),
            "editNote": parameter=> this.editNote(parameter.id, parameter.title),
            "editNoteSave": parameter=> this.editNoteSave(parameter.id, parameter.title)

        }


    }

    spliceStore(data) {
        let i;
        let len = data.length;
        let view = '';
        let copyDefalt = this.defaultTemplate;
        let hashString = "";
        console.log(data);
        for (i = 0; i < len; i++) {
            copyDefalt = copyDefalt.replace("{{title}}", data[i].title);
            copyDefalt = copyDefalt.replace("{{id}}", data[i].id);
            // console.log(data[i]);
            data[i].hashtags.forEach((tag)=> {
                hashString += "<li class='tag'>" + tag + "</li>";
            });
            copyDefalt = copyDefalt.replace("{{hashtags}}", hashString);

            view += copyDefalt;
            hashString = "";
            copyDefalt = this.defaultTemplate;
        }
        // console.log(view);

        return view;
    }

    removeItem(id) {
        let element = document.querySelector('[data-id="' + id + '"]');
        if (element)
            this.$notesList.removeChild(element);
    }

    editNote(id, title) {
        // console.log(id);
        // console.log(title);

        let element = document.querySelector('[data-id="' + id + '"]');
        // element.className += " editing";
        console.log(element.className.replace(" static", " editing"));
        element.className = element.className.replace(" static", " editing");
        console.log(element.className);

        let div = document.createElement('div');
        div.contentEditable = true;
        div.className = 'edit';
        element.appendChild(div);

        div.focus();
        div.innerHTML = title;

        $on(div, 'keyup', function (e) {
            let self = this;
            var savedSel = saveSelection(self);
            console.log(self.innerHTML);
            if (self.innerHTML.length > 0) {

                self.innerHTML = self.innerHTML.replace(/(#[a-z\d-]+)(\s+)(.+)(<\/span>)/ig,
                    "$1$2$4$3");

                self.innerHTML = self.innerHTML.replace(/(<span class="hash_tag">)(.+)(<span class="hash_tag">)(.+)(<\/span>)(.+)(<\/span>)/ig,
                    "$2$3$4$5$6");

                self.innerHTML = self.innerHTML.replace(/(#[a-z\d-]+)($|\s)/ig,
                    "<span class='hash_tag'>$1</span> ");
                self.innerHTML = self.innerHTML.replace(/(#[a-z\d-]+)($|\s)/ig,
                    "<span class='hash_tag'>$1</span> ");

                self.innerHTML = self.innerHTML.replace(/(#[a-z\d-]+)(&nbsp;)/ig,
                    "<span class='hash_tag'>$1</span>&nbsp;");

                self.innerHTML = self.innerHTML.replace(/(#[a-z\d-]+)(&)/ig,
                    "<span class='hash_tag'>$1</span>&");

            }
            restoreSelection(self, savedSel);
        })
    }

    editNoteSave(id, title) {

        let element = document.querySelector('[data-id="' + id + '"]');
        element.className.replace(" editing", " static");

        let input = element.querySelector('.edit');
        if (input)
            element.removeChild(input);

    }

    bind(event, handler) {
        if (event === "newNote") {
            this.$newNote.addEventListener('keyup', (event)=> {
                if (event.keyCode == 13)
                    return handler(this.$newNote.value)
            });
        }
        else if (event === "removeNote") {
            $delegate(this.$notesList, '.removeNote', 'click', function () {
                handler({id: _getNoteId(this)})
            })
        }
        else if (event === "editItem") {

            $delegate(this.$notesList, 'li p', 'dblclick', function () {
                // console.log('editItem');

                handler({id: _getNoteId(this)})
            });

            $delegate(this.$notesList, '.editNote', 'click', function () {
                // console.log('editItem');

                handler({id: _getNoteId(this)})
            });


        }
        else if (event === 'editItemSave') {
            // console.log(this.p);

            $delegate(this.$notesList, '.saveNote', 'click', function () {
                handler({
                    id: _getNoteId(this),
                    hashtags: _getHashtags(),
                    title: getTitle()
                })
            });
            let _edit = document.querySelector(".edit");

            if (_edit) {
                $on(_edit, 'keyup', function (e) {
                    console.log(e.keyCode);
                    /*
                     handler({
                     id: _getNoteId(this),
                     hashtags: _getHashtags(),
                     title: getTitle()
                     })*/
                    ;
                });
            }
        }
        else if (event === 'filterByHashtag') {
            $delegate(this.$notesList, '.tag', 'click', function () {
                console.log(this.innerHTML);
                handler({tag: this.innerHTML});
            })
        }
    }


    render(viewCommand, parameter) {
        this.commands[viewCommand](parameter);
    }


}