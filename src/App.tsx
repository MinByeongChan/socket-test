import { ChangeEventHandler, useEffect, useState } from 'react';
import './App.css'

function App() {
  const[ isConnected, setConnected ] = useState(false)
  const [input, setInput]  = useState('')
  const [messageList, setMessageList] = useState<string[]>([])
  
  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log('e', e)
    setInput(e.target.value)

  }
  const socket = new WebSocket("wss://javascript.info/article/websocket/chat/ws");


  const handleSendMessage = () => {
    console.log('input', input)
    console.log('socket', socket)
    console.log('socket.OPEN', socket.OPEN)
    if(!socket.OPEN) return ;
    socket.send(input)
  }

  useEffect(() => {
    console.log('socket', socket)

    socket.onopen = function(e) {
      setMessageList((prev) => [...prev, '[open] 커넥션이 만들어졌습니다.', '데이터를 서버에 전송해봅시다.'])
      if(e.type === 'open') {
        setConnected(true)
        socket.send("[보낸 메세지] My name is Byeong Chan");
      }
    };
    
    socket.onmessage = function(event) {
      console.log(`[message] 서버로부터 전송받은 데이터: ${event.data}`);
      setMessageList((prev) => [...prev, `[message] 서버로부터 전송받은 데이터: ${event.data}`])
    };
    
    socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`[close] 커넥션이 정상적으로 종료되었습니다(code=${event.code} reason=${event.reason})`);
      } else {
        // 예시: 프로세스가 죽거나 네트워크에 장애가 있는 경우
        // event.code가 1006이 됩니다.
        console.log('[close] 커넥션이 죽었습니다.');
      }
    };
    
    socket.onerror = function(error) {
      console.log(`[error]`);
    };
    
  }, [])

  return (
    <div>
      <p>
        {isConnected && <span>연결이 완료되었습니다.</span>}
      </p>
      <form>
        <input type='text' name='text' value={input} onChange={handleChangeInput} disabled={!isConnected} />
        <button type='button' name='submit' onClick={handleSendMessage} disabled={!isConnected}>전송</button>
      </form>

      <ul>
        {messageList.map((data, id) => (
          <li key={id}>{data}</li>
        ))}
      </ul>
      
    </div>
  )
}

export default App
