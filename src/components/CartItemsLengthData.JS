import React from 'react'

export default function CartItemsLengthData() {
    const [dataLength, setDataLength] = useState(() => {
        const storedCartData = localStorage.getItem('cartDatalength');
        return storedCartData ? JSON.parse(storedCartData) : [];

    })
    return (
        <div></div>
    )
}
