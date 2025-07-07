import React from 'react'
import './OrderNavBar.css'
import { Link } from 'react-router-dom'

const OrderNavBar = () => {
  return (
    <div className="order-headers">
            <img src="https://imgs.search.brave.com/tpbN1OR8WYI7zl_eUjxN0az6xyPR9m2dGyIgtMhjGzw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTAv/NjI3LzkxNS9zbWFs/bC9jb2ZmZWUtc2hv/cC1sb2dvLWRlc2ln/bi10ZW1wbGF0ZS1j/b2ZmZWUtdmludGFn/ZS1sb2dvLWRlc2ln/bi12ZWN0b3IuanBn"></img>
            <span>ORDER</span>
            <span style={{marginLeft : "auto", paddingRight : "30px", backgroundColor : "white"}}> 
                <Link to = '/'>
                <img style={{backgroundColor : "white", height : "30px", width : "30px"}}src = "https://img.icons8.com/?size=100&id=54152&format=png&color=000000"></img></Link> </span>
    </div>
  )
}

export default OrderNavBar