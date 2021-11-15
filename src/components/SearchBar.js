import React from 'react'
import { Form } from "react-bootstrap"

export default function SearchBar({search, setSearch}) {
    return (
        <div>
        <Form.Control
        type="search"
        placeholder="Search for artists/Songs"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
        </div>
    )
}
