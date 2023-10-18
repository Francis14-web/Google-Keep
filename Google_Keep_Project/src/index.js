class App{
    constructor(){
        this.notes = JSON.parse(localStorage.getItem('notes')) || []
        this.title = ''
        this.text = ''
        this.id = ''


        this.$notes = document.getElementById('notes')
        this.$form = document.getElementById('form')
        this.$noteTitle = document.getElementById('note-title')
        this.$formButtons = document.getElementById('form-buttons')
        this.$noteText = document.getElementById('note-text')
        this.$placeHolder = document.getElementById('placeholder')
        this.$closeButton = document.getElementById('form-close-button')
        this.$modal = document.getElementById('modal')
        this.$modalTitle = document.getElementById('modal-title')
        this.$modalText = document.getElementById('modal-text')
        this.$modalCloseButton = document.getElementById('modal-close-button')
        this.$colorToolTip = document.getElementById('color-tooltip')
        
        this.render()
        this.addEventListener()
    }

    addEventListener(){
        document.body.addEventListener('click', event =>{
            this.handleFormClick(event)
            this.selectNote(event)
            this.openModal(event)
            this.deleteNote(event)
        })


        document.body.addEventListener('mouseover', event =>{
            this.openTooltip(event)
        })

        document.body.addEventListener('mouseout', event =>{
            this.closeTooltip(event)
        })

        this.$colorToolTip.addEventListener('mouseover', function() {
            this.classList.add('flex')
        })

        this.$colorToolTip.addEventListener('mouseout', function() {
            this.classList.add('hidden')
        })

        this.$form.addEventListener('submit', event =>{
            event.preventDefault();
            const title = this.$noteTitle.value
            const text = this.$noteText.value
            const hasNote = title || text
            

            if(hasNote){
                this.addNote({title , text})
            }
        })

        this.$closeButton.addEventListener('click', event =>{
            event.stopImmediatePropagation()
            this.closeForm()
        })

        this.$modalCloseButton.addEventListener('click', event =>{
            this.closeModal(event)
        })
    }





    handleFormClick(event){
        const isFormCLicked = this.$form.contains(event.target)

        if(isFormCLicked){
            this.openForm()
        }
        else{
            this.closeForm()
        }
    }

    openForm(){
        this.$form.classList.add('shadow-md')
        this.$noteTitle.classList.remove('hidden')
        this.$formButtons.classList.remove('hidden')
    }


    closeForm(){
        this.$form.classList.remove('shadow-md')
        this.$noteTitle.classList.add('hidden')
        this.$formButtons.classList.add('hidden')
        this.$noteTitle.value = "";
        this.$noteText.value = "";
    }


    openModal(event) {
        if(event.target.matches('#toolbar-delete')) return

        if (event.target.closest('#note')){
            this.$modal.classList.remove('hidden')
            this.$modal.classList.add('opacity-100')
            this.$modalTitle.value = this.title
            this.$modalText.value = this.text
        }
    }

    closeModal(event){
        this.editNote()
        this.$modal.classList.add('hidden')
        this.$modal.classList.remove('opacity-100')
    }

    openTooltip(event){
        if(!event.target.matches('#toolbar-color')) return
        this.id = event.target.nextElementSibling.dataset.id
        const noteCoords = event.target.getBoundingClientRect()

        const horizontal = noteCoords.left + window.scrollX
        const vertical = noteCoords.top + window.scrollY

        this.$colorToolTip.classList.add ('flex', `translate-x-[${Math.ceil(horizontal)}px]`, `translate-y-[${Math.ceil(vertical)}px]`)
        this.$colorToolTip.classList.remove('hidden')
    }

    closeTooltip(event){
        if(!event.target.matches('#toolbar-color')) return
        this.$colorToolTip.classList.add('hidden')
    }


    addNote({title, text}){
        const newNote = {
            title,
            text,
            color: "red-500",
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
        }

        this.notes = [...this.notes, newNote]
        this.render()
        this.closeForm()
    }

    editNote(){
        const title = this.$modalTitle.value
        const text = this.$modalText.value


        this.notes = this.notes.map(note =>
            note.id === Number(this.id) ? {...note, title, text} : note)
            this.render()
    }

    selectNote(event){
        const $selectedNote = event.target.closest('#note')
        if(!$selectedNote) return
        const [$noteTitle, $noteText] = $selectedNote.children
        this.title = $noteTitle.innerText
        this.text = $noteText.innerText
        this.id = $selectedNote.dataset.id
    }

    deleteNote(event){
        event.stopPropagation()
        if(!event.target.matches('#toolbar-delete')) return
        const id = event.target.dataset.id 

        this.notes = this.notes.filter(note => note.id !== Number(id))
        this.$placeHolder.classList.remove('hidden')
        this.$placeHolder.classList.add('flex', 'flex-col')
        this.render()
    }

    render(){
        this.saveNotes()
        this.displayNotes()   
    }

    saveNotes(){
        localStorage.setItem('notes', JSON.stringify(this.notes))
    }

    displayNotes(){
        const hasNotes = this.notes.length > 0
        hasNotes ? this.$placeHolder.classList.add('hidden') : this.$placeHolder.classList.add('flex', 'flex-col')

        this.$notes.innerHTML = this.notes.map(note => `
            <div class="bg-gray-300 flex flex-col justify-between m-4 w-64 border border-[#d3d3d3] border-opacity-100 border-[1px] border-solid border-gray-300 box-border overflow-hidden relative rounded-[8px]" id="note" data-id="${note.id}">
                
                <div class="${note.title && 'w-full focus:outline-none min-h-43 mx-1 px-2.5 py-2.5  text-base font-medium leading-6 border-0'}">
                    ${note.title}
                </div>

                <div class="w-full focus:outline-none h-43 min-h-43 mx-1 px-2.5 py-2.5 text-base font-medium leading-6 tracking-tighter border-0  overflow-hidden relative">
                    ${note.text}
                </div>

                <div id="toolbar-container" class="">
                    <div class="hover:opacity-100 opacity-0 flex-row-reverse items-center text-gray-500 flex text-sm leading-5 my-4 relative transition-opacity transition-bg transition-shadow">
                        <img src="https://icon.now.sh/palette" id="toolbar-color" class="h-5 w-5 my-2  cursor-pointer text-gray-700 opacity-70"">
                        <img src="https://icon.now.sh/delete" data-id=${note.id} id="toolbar-delete" class="h-5 w-5 my-2  cursor-pointer text-gray-700 opacity-70"">
                    </div>

                </div>
            </div>
        `).join("")
    }
}

new App()