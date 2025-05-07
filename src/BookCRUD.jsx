import React, { useState, useEffect } from 'react';
import { 
  Container, Button, Form, Modal, 
  Row, Col, Card, Navbar, Nav, Badge 
} from 'react-bootstrap';
import { 
  FaEdit, FaTrash, FaPlus, FaSignOutAlt,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
  FaBook, FaUserAlt, FaCalendarAlt
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const BookCRUD = () => {
  // Palette de couleurs
  const colors = {
    primary: '#9c27b0',
    secondary: '#e91e63',
    light: '#f8f1ff',
    dark: '#4a148c',
    accent: '#ff4081'
  };

  // Données initiales vérifiées
  const defaultBooks = [
    {
        id: '4',
        title: 'L\'Alchimiste',
        author: 'Paulo Coelho',
        year: '1988',
        genre: 'Roman philosophique',
        description: 'Un conte philosophique sur la quête de soi et la réalisation de sa légende personnelle.',
        image: 'https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg'
      },
    {
      id: '2',
      title: '1984',
      author: 'George Orwell',
      year: '1949',
      genre: 'Dystopie',
      image: 'https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      id: '3',
      title: 'Harry Potter',
      author: 'J.K. Rowling',
      year: '1997',
      genre: 'Fantasy',
      image: 'https://m.media-amazon.com/images/I/81m1s4wIPML._AC_UF1000,1000_QL80_.jpg'
    }
  ];

  // États
  const [books, setBooks] = useState(defaultBooks);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    genre: '',
    image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();

  // Gestion responsive
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setBooks(books.map(book => 
        book.id === editingId ? { ...book, ...formData } : book
      ));
    } else {
      setBooks([...books, { 
        id: Date.now().toString(), 
        ...formData,
        image: formData.image || 'https://via.placeholder.com/300x450?text=No+Cover'
      }]);
    }
    resetForm();
  };

  // Édition d'un livre
  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      year: book.year,
      genre: book.genre,
      image: book.image
    });
    setEditingId(book.id);
    setShowModal(true);
  };

  // Suppression d'un livre
  const handleDelete = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  // Réinitialisation du formulaire
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      year: '',
      genre: '',
      image: ''
    });
    setEditingId(null);
    setShowModal(false);
  };

  // Déconnexion
  const handleLogout = () => {
    navigate('/auth');
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.light, width: "100vw",       // Prend toute la largeur de la vue
      overflowX: "hidden" }}>
      {/* Navbar */}
      <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: colors.primary }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-white" style={{
            fontSize: isSmallScreen ? "1.8rem" : "2.5rem",
            fontFamily: "'Comic Sans MS', cursive, sans-serif",
            fontWeight: 'bold'
          }}>
            <FaBook className="me-2" />
            GoBooks
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 text-white" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {['Accueil', 'Bibliothèque', ].map((item) => (
                <Nav.Link 
                  key={item} 
                  as={Link} 
                  to={`/${item.toLowerCase()}`} 
                  className="text-white mx-2 fw-medium"
                  style={{
                    fontFamily: "'Comic Sans MS', cursive, sans-serif"
                  }}
                >
                  {item}
                </Nav.Link>
              ))}
              <Button 
                variant="outline-light" 
                onClick={handleLogout}
                className="ms-lg-3 rounded-pill"
                style={{ 
                  borderWidth: '2px',
                  fontWeight: '600'
                }}
              >
                <FaSignOutAlt className="me-1" /> Déconnexion
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenu principal */}
      <Container className="py-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0" style={{ 
            color: colors.dark,
            fontFamily: "'Comic Sans MS', cursive",
            fontWeight: 'bold'
          }}>
            Ma Collection de Livres
          </h2>
          <Button 
            onClick={() => setShowModal(true)}
            className="rounded-pill fw-bold"
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.secondary,
              padding: '10px 20px'
            }}
          >
            <FaPlus className="me-2" /> Ajouter un Livre
          </Button>
        </div>

        {/* Grille de livres */}
        <Row xs={1} md={2} lg={3} className="g-4">
          {books.map(book => (
            <Col key={book.id}>
              <Card className="h-100 shadow-sm border-0 overflow-hidden" style={{ 
                borderRadius: '15px',
                transition: 'transform 0.3s',
                ':hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <div style={{ 
                  height: '350px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <Card.Img 
                    variant="top" 
                    src={book.image} 
                    style={{ 
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover'
                    }} 
                  />
                  <Badge 
                    pill 
                    className="position-absolute top-0 end-0 m-2" 
                    style={{ 
                      backgroundColor: colors.accent,
                      fontSize: '0.8rem'
                    }}
                  >
                    {book.genre}
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title 
                    className="mb-3" 
                    style={{ 
                      color: colors.primary,
                      fontWeight: 'bold'
                    }}
                  >
                    {book.title}
                  </Card.Title>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FaUserAlt className="me-2" style={{ color: colors.secondary }} />
                      <span>{book.author}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="me-2" style={{ color: colors.secondary }} />
                      <span>{book.year}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto d-flex justify-content-between">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => handleEdit(book)}
                      className="rounded-pill px-3"
                      style={{ 
                        borderColor: colors.primary,
                        color: colors.primary
                      }}
                    >
                      <FaEdit className="me-1" /> Modifier
                    </Button>
                    <Button 
                      variant="outline-danger"
                      onClick={() => handleDelete(book.id)}
                      className="rounded-pill px-3"
                    >
                      <FaTrash className="me-1" /> Supprimer
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal d'ajout/modification */}
        <Modal show={showModal} onHide={resetForm} centered size="lg">
          <Modal.Header 
            closeButton 
            className="text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <Modal.Title style={{ fontFamily: "'Comic Sans MS', cursive" }}>
              {editingId ? 'Modifier le livre' : 'Ajouter un livre'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit} id="bookForm">
              <Row>
                <Col md={6} className="mb-4 mb-md-0">
                  <div 
                    className="d-flex justify-content-center align-items-center border rounded"
                    style={{ 
                      height: '350px',
                      backgroundColor: '#f9f9f9',
                      overflow: 'hidden'
                    }}
                  >
                    {formData.image ? (
                      <img 
                        src={formData.image} 
                        alt="Couverture" 
                        className="img-fluid h-100"
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="text-center" style={{ color: colors.primary }}>
                        <FaBook size={60} className="mb-3" />
                        <p>Aperçu de la couverture</p>
                      </div>
                    )}
                  </div>
                  <Form.Group className="mt-3">
                    <Form.Label>URL de l'image</Form.Label>
                    <Form.Control
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Titre *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Auteur *</Form.Label>
                    <Form.Control
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Année *</Form.Label>
                    <Form.Control
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Genre *</Form.Label>
                    <Form.Control
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Annuler
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              form="bookForm"
              style={{ 
                backgroundColor: colors.secondary,
                borderColor: colors.secondary
              }}
            >
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      {/* Footer */}
      <footer className="py-4 mt-auto" style={{ backgroundColor: colors.dark }}>
        <Container>
          <Row className="align-items-center">
            <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
              <h5 style={{ color: colors.accent }} className="mb-2">
                <FaBook className="me-2" />
                GoBooks
              </h5>
              <p className="mb-0 text-white-50">Votre bibliothèque digitale</p>
            </Col>
            <Col md={4} className="text-center mb-3 mb-md-0">
              <div className="d-flex justify-content-center gap-3">
                <a href="#" style={{ color: colors.accent }}>
                  <FaFacebook size={20} />
                </a>
                <a href="#" style={{ color: colors.accent }}>
                  <FaTwitter size={20} />
                </a>
                <a href="#" style={{ color: colors.accent }}>
                  <FaInstagram size={20} />
                </a>
                <a href="#" style={{ color: colors.accent }}>
                  <FaLinkedin size={20} />
                </a>
              </div>
            </Col>
            <Col md={4} className="text-center text-md-end">
              <p className="mb-1 text-white-50">
                © {new Date().getFullYear()} GoBooks
              </p>
              <div>
                <Button variant="link" className="text-white-50 p-0 me-2">
                  Mentions
                </Button>
                <Button variant="link" className="text-white-50 p-0">
                  Confidentialité
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default BookCRUD;