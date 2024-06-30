import { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

const Editor = ({socketRef,roomId,onCodeChange}) => {
  const editorRef=useRef(null)
  useEffect(()=>{
      async function init(){
      const editor=CodeMirror.fromTextArea(document.getElementById('code'),
        {
          mode: {name:'javascript', json:true},
          theme:'dracula',
          autoCloseTags:true,
          autoCloseBrackets:true,
          lineNumbers:true
        });
      editorRef.current=editor
      editor.setSize(null,"100%")
      editorRef.current.on("change",(instance,changes)=>
        {
          
          const {origin}=changes;
          const code=instance.getValue();
          onCodeChange(code);
         
          if(origin!=="setValue"){
          socketRef.current.emit("code-change",{
              roomId,
              code,
            })
          }
        });
     };
   init();
  },[])
  useEffect(()=>{
    if(socketRef.current){
      socketRef.current.on("code-change",({code})=>{
        if(code!==null){
          editorRef.current.setValue(code);
        }
      });
    }
    return ()=>{
      socketRef.current.off("code-change");
    }
  
    },[socketRef.current])
  return (
    <div className="h-screen">
      <textarea className='' name="" id="code"  ></textarea>
    </div>
  )
}


export default Editor