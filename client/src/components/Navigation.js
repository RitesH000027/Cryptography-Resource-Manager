// Update prop names to use $ prefix
return (
  <Nav>
    <Drawer $isOpen={isOpen}>
      {categories.map(cat => (
        <NavItem
          key={cat}
          $active={category === cat}
          onClick={() => handleCategoryChange(cat)}
        >
          {cat}
        </NavItem>
      ))}
    </Drawer>
  </Nav>
);
