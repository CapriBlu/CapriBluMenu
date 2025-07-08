// global var declaration
const files = {
      // fr: 'pdf/menu-fr.pdf',
      // es: 'pdf/menu-es.pdf',
      it: 'pdf/menu-it-eng.pdf',
      //en: 'pdf/menu-it-eng.pdf'
    };


//auto generate lenguage boton 
function createLenguageRadio(){
  const container = document.getElementById("language-selector");
  if (!container) {
    console.error("Container not found:", containerId);
    return;
  }

  //create radio input
  Object.entries(files).forEach(([key]) => {
  const input = document.createElement("input");
  input.type = "radio";
  input.id = key;
  input.name = "language";
  input.value = key;

  const label = document.createElement("label");
  label.htmlFor = key;
  label.className = `flag flag-${key}`;
  label.title = key;
  
  //add listener 
  input.addEventListener('change', function () {
    const lang = this.value;

    const filename = files[lang];
    if (filename) {
      downloadFile(filename);
    }
    
  });

  container.appendChild(input);
  container.appendChild(label);

  });
}

//download request
function downloadFile(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = url.split('/').pop(); 
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

//main for execute 
function main(){
  console.log("Main start")
  createLenguageRadio()
}

//run for main
main()

