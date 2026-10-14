import {useState} from "react";

//1.Todo型の定義（ルール決め:id,title,status,detailを持つオブジェクト）
type Todo={
  id:number;
  title:string;
  status:"未着手"|"進行中"|"完了";
  detail:string;
}

function App(){
//2.複数のTodoデータ（配列）をuseStateで管理
  const[todos,setTodos]=useState<Todo[]>([
    {
      id:1,
      title:"Reactの学習",
      status:"進行中",
      detail:"絞り込み機能を実装する"
      },
    
    {
      id:2,
      title:"お買い物",
      status:"未着手",
      detail:"食材を買う"
    },

    {
      id:3,
      title:"部屋の掃除",
      status:"完了",
      detail:"デスク周りを綺麗にする"
    }
      
  ])

//1.入力フォームの値を管理するためのStateを用意
const [inputTitle,setInputTitle]=useState("")
const[inputDetail,setInputDetail]=useState("")

//「現在選択されている絞り込み条件」を管理するState(初期値は'すべて')
const[filterStatus,setFilterStatus]=useState<'すべて'|'未着手'|'進行中'|'完了'>('すべて')


//2.追加ボタンが押された時の処理（関数）を作る
const handleAddTodo=()=>{
//タイトルが空っぽのときは追加しないようにする
  if(inputTitle==="")return;
//新しいTODOオブジェクトの作成
  const newTodo:Todo={
    id:Date.now(),//現在の時刻をミリ秒で取得、重ならないIDにする
    title:inputTitle,
    status:"未着手",//最初は「未着手」で固定
    detail:inputDetail
  }
  //今あるtodosに新しいnewTodoを追加してStateを更新
  //「...todos」は今までのTODOをすべて展開して並べるという意味
  setTodos([...todos,newTodo])

  //追加が終わったら、入力欄を空っぽに戻す（次を入力するため）
  setInputTitle("")
  setInputDetail("")
  }

  //1.削除ボタンが押されたときの処理（関数）を追加する
  const handleDeleteTodo=(id:number)=>{
  //filterを使って「クリックされた(削除ボタン押した)TODOとは違うID」のTODOだけを一覧に残す
  const filteredTodos=todos.filter((todo)=>todo.id !==id)
  //残ったTODOのリストでStateを更新する
  setTodos(filteredTodos)
}

//ステータスを切り替える関数の追加
const handleToggleStatus=(id:number)=>{
  const updatedTodos=todos.map((todo)=>{
    //該当するIDのTODOを見つけたら、ステータスを順番に変更する
    if(todo.id===id){
      let nextStatus:'未着手'|'進行中'|'完了'='未着手'
      if(todo.status==='未着手')nextStatus='進行中'
      else if(todo.status==='進行中')nextStatus='完了'
      else if(todo.status==='完了')nextStatus='未着手'
      //...toso(ほかの情報はそのまま)で、statusだけ更新した新しいオブジェクトを返す
      return{...todo,status:nextStatus}
    }
    //IDが違うTODOはそのまま返す
    return todo
  })
  setTodos(updatedTodos)
}

//★絞り込み条件に基づいて表示用TODOを作る
const displayedTodos=todos.filter((todo)=>{
  if(filterStatus==='すべて')return true;//すべての場合は全員合格！
  return todo.status===filterStatus;//条件に一致するTODOだけ合格！
})


//ここからどのようなものを画面に返すかの処理
return(
<div style={{padding:"20px"}}>
  <h1>マイTODOリスト</h1>

{/*3.入力フォームを画面に用意*/}
  <div style={{
    marginBottom:"20px",
    padding:"15px",
    border:"1px solid #aaa",
    borderRadius:"5px"
  }}>
    <h3>新しいTODOを追加</h3>
    <div style={{marginBottom:"10px"}}>
      <label>タイトル：</label>
      <input
        type="text"
        value={inputTitle}        
        onChange={(e)=>setInputTitle(e.target.value)}
        placeholder="何をする？"/>
    </div>
    <div style={{marginBottom:"10px"}}>
      <label>詳細：</label>
      <input 
       type="text"
       value={inputDetail}
       onChange={(e)=>setInputDetail(e.target.value)}
       placeholder="詳しい内容"/>
    </div>
    <button onClick={handleAddTodo}>追加する</button>
    </div>

{/*★絞り込み切り替えボタン */}
<div style={{marginBottom:'15px'}}>
  <span style={{marginRight:'10px'}}>*絞り込み：*</span>
  {(['すべて','未着手','進行中','完了']as const).map((status)=>(
    <button 
    key={status} 
    onClick={()=>setFilterStatus(status)}
    style={{
      marginRight:'5px',
      fontWeight:filterStatus===status?'bold':'normal'
    }}
    >
      {status}
    </button>
  ))}
</div>



    {/*TODO一覧の表示*/}
    <ul>
      {displayedTodos.map((todo)=>(
        <li key={todo.id} style={{
          marginBottom:"15px",
          listStyle:"none",
          borderBottom:"1px solid #eee",
          paddingBottom:"10px"}}>
            <div>*ID:*{todo.id}</div>
            <div>*タイトル:*{todo.title}</div>
            <div>*ステータス：*{todo.status}</div>
            <div>*詳細：*{todo.detail}</div>

            {/*ステータス変更ボタンを追加*/}
            <button onClick={()=>handleToggleStatus(todo.id)} style={{marginRight:"5px"}}>ステータス変更</button>
            {/*2.削除ボタンにクリックイベントを設定*/}
            {/*クリックされたTODOのidを関数に渡す*/}
            <button onClick={()=>handleDeleteTodo(todo.id)}>削除</button>
          </li>
      ))}
    </ul>

</div>
  
)
}
 export default App