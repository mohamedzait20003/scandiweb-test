import React, { useState, useEffect } from 'react'

const Category = ({ category }) => {
  return (
    <div>
      <h1>{category.name}</h1>
    </div>
  )
}

export default Category