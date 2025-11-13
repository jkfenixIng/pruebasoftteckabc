
# ABC Company - Sistema de Gestión de Productos

Sistema completo para la gestión de productos de una empresa distribuidora de gaseosas y refrescos. Incluye backend en .NET 8 y frontend en HTML/CSS/JS.

---

## 🏗️ Estructura del Proyecto

### Backend (.NET 8 API)

```
ABC/
├── Controllers/
│   ├── AuthController.cs          # Autenticación JWT
│   └── ProductsController.cs      # CRUD de productos
├── Data/
│   └── ApplicationDbContext.cs    # Contexto de base de datos
├── DTOs/
│   └── ProductDTO.cs              # Objetos de transferencia
├── Models/
│   └── Product.cs                 # Modelo principal
├── Services/
│   ├── IProductService.cs         # Interfaz del servicio
│   └── ProductService.cs          # Lógica de negocio
├── abc_company.db                 # Base de datos SQLite
├── appsettings.json               # Configuración
└── Program.cs                     # Punto de entrada
```

### Frontend (HTML/CSS/JS)

```
├── components/              # Componentes modulares
│   ├── modals/
│   │   ├── add-product.html
│   │   ├── edit-product.html
│   │   ├── update-prices.html
│   │   └── update-stock.html
│   ├── app-layout.html
│   ├── login.html
│   └── navbar.html
├── css/
│   └── styles.css          # Estilos personalizados
├── js/                     # Lógica de aplicación
│   ├── auth.js            # Manejo de autenticación
│   ├── api.js             # Comunicación con backend
│   ├── ui.js              # Manipulación del DOM
│   ├── productManager.js  # Lógica de negocio
│   ├── utils.js           # Utilidades
│   ├── componentLoader.js # Carga de componentes
│   └── app.js             # Punto de entrada
└── index.html             # Página principal
```

---

## 📋 Prerrequisitos

### Backend
- .NET 8 SDK
- Visual Studio 2022 o Visual Studio Code
- SQLite (incluido automáticamente)

### Frontend
- Servidor web (IIS Express, Live Server, etc.)
- Navegador moderno (Chrome, Firefox, Edge)

- Backend ejecutándose en `https://localhost:44350` (revisar puerto de ejecución local)

---

## 🚀 Configuración y Ejecución

### Backend

En Visual Studio Code (ejemplo):

```powershell
git clone [url-del-repositorio]
cd ABC
dotnet restore
dotnet run
```

En Visual Studio 2022 o superior: abrir la solución del proyecto.

La API estará disponible en: `https://localhost:44350` (confirmar puerto en ejecución local).

Swagger UI: `https://localhost:44350/swagger`

### Frontend

Abrir `index.html` en el navegador o usar Live Server de VS Code.

---

## Backend - `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=abc_company.db"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyHereThatIsAtLeast32CharactersLong!",
    "Issuer": "ABC.Company",
    "Audience": "ABC.Company.Client"
  }
}
```

## Frontend - Configuración de API

En `js/app.js`:

```js
const API_BASE_URL = 'https://localhost:44350/api';
```

---

## 🔐 Autenticación

- Usuario por defecto: `admin`
- Contraseña: `password`
- Esquema: JWT Bearer Token

---

## 📚 Endpoints Principales

**Autenticación**

- `POST /api/auth/login` - Iniciar sesión

**Productos**

- `GET /api/products` - Listar todos los productos
- `GET /api/products/{id}` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/{id}` - Actualizar producto completo
- `PATCH /api/products/{id}/stock` - Actualizar solo stock
- `PATCH /api/products/{id}/prices` - Actualizar solo precios
- `DELETE /api/products/{id}` - Eliminar producto

---

## 🗃️ Modelo de Datos

```csharp
public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal RetailPrice { get; set; }    // Precio al detal
    public decimal WholesalePrice { get; set; } // Precio al por mayor
    public string Location { get; set; }        // Ubicación en estiba
    public int Stock { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
}
```

---

## 📱 Funcionalidades del Frontend

**Gestión de Productos**

- ✅ Listar productos con ubicación y precios
- ✅ Agregar nuevos productos
- ✅ Editar productos existentes
- ✅ Actualizar existencias (stock)
- ✅ Actualizar precios (detal y mayor)
- ✅ Eliminar productos

**Características de UX**

- ✅ Interfaz responsive
- ✅ Validaciones en tiempo real
- ✅ Feedback visual para acciones
- ✅ Mensajes de confirmación
- ✅ Indicadores de carga

---

## 🎯 Uso de la Aplicación

**Iniciar Sesión**

- Ingresar credenciales (`admin` / `password`)
- El sistema redirige automáticamente

**Ver Productos**

- Lista en grid con tarjetas de productos
- Información: nombre, descripción, precios, ubicación, stock

**Gestionar Productos**

- Agregar: Botón "Nuevo Producto"
- Editar: Ícono de edición (lápiz) en tarjeta
- Stock: Ícono de cajas en tarjeta
- Precios: Ícono de dólar en tarjeta
- Eliminar: Ícono de basura en tarjeta

---

## 🛠️ Desarrollo y Modificaciones

### Backend

Para agregar nuevos modelos:

- Crear clase en `Models/`
- Agregar `DbSet` en `ApplicationDbContext`
- Crear migración: `dotnet ef migrations add [Nombre]`
- Actualizar base: `dotnet ef database update`

Para nuevos servicios:

- Crear interfaz en `Services/`
- Implementar servicio
- Registrar en `Program.cs`

### Frontend

Modificar estilos (ejemplo en `css/styles.css`):

```css
:root {
    --primary-color: #0d6efd;    /* Color principal */
    --success-color: #198754;    /* Color éxito */
    /* ... más variables */
}
```

Agregar nuevas funcionalidades:

- Crear componente en `components/`
- Actualizar `componentLoader.js` si es necesario
- Agregar lógica en el archivo JS correspondiente

---

## 🧪 Testing

### Backend con Swagger

1. Ejecutar la aplicación
2. Ir a `https://localhost:44350/swagger`
3. Usar el endpoint `/api/auth/login` para obtener token
4. Hacer clic en "Authorize" y pegar el token: `Bearer [tu-token]`
5. Probar todos los endpoints

### Frontend

- Asegurarse de que el backend esté ejecutándose
- Abrir la aplicación en el navegador
- Probar el flujo completo de gestión de productos

---

## 🔧 Tecnologías Utilizadas

**Backend**

- .NET 8
- Entity Framework Core
- SQLite
- JWT Authentication
- Swagger/OpenAPI

**Frontend**

- HTML5
- CSS3
- JavaScript ES6+
- Bootstrap 5
- Font Awesome
- Fetch API

---

## 🚨 Solución de Problemas

- **Error de CORS**: Verificar que el backend esté ejecutándose y confirmar la URL en `API_BASE_URL` en el frontend.
- **Token expirado**: La aplicación redirige automáticamente al login.
- **Componentes no cargan**: Verificar estructura de carpetas y revisar consola del navegador para errores.
- **Base de datos no se crea**: Verificar permisos de escritura y revisar connection string en `appsettings.json`.

---

## 📦 Paquetes NuGet Utilizados (Backend)

- Microsoft.EntityFrameworkCore.Sqlite
- Microsoft.AspNetCore.Authentication.JwtBearer
- Swashbuckle.AspNetCore
- Microsoft.EntityFrameworkCore.Design

---

## 📞 Soporte

Para issues o mejoras, revisar la consola del navegador (F12) y verificar que el backend esté respondiendo.

---

## 🎉 ¡Listo para Usar!

- ✅ Backend .NET con seguridad JWT
- ✅ Frontend responsive con todas las operaciones CRUD
- ✅ Base de datos SQLite con Entity Framework
- ✅ Arquitectura modular y mantenible
- ✅ Validaciones y manejo de errores
- ✅ Documentación completa

¡Disfruta usando el sistema de gestión de productos de ABC Company!