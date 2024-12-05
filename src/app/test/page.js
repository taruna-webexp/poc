"use client"
import { Button } from '@mui/material'
import React from 'react'

export default function Test() {

    let res = { data: { id: undefined } }
    const { data } = res
    const idd = data.hasOwnProperty('id')
        ? data.id !== undefined ? data.id : "def"
        : "def";



    console.log("iiiiii", idd)
    const handleClick = (id) => {
        alert(`hey id ${id}`)
    }
    return (
        <div><Button onClick={() => handleClick(idd)} >click me please </Button></div>
    )
}
