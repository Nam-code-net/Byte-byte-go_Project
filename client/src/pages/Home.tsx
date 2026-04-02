import { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import ChapterContent from "@/components/ChapterContent";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import HeroSection from "@/components/HeroSection";
import ThemeToggle from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Trophy,
  Target,
  Clock
} from "lucide-react";

interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  sections: {
    id: string;
    title: string;
    content: string;
    code?: string;
    codeLanguage?: string;
  }[];
}

const chapters: Chapter[] = [
  {
    id: "chapter-1",
    number: 1,
    title: "Kiến trúc 3 Lớp & Vai trò của Model",
    description:
      "Kiến trúc 3 lớp giúp phân tách trách nhiệm rõ ràng trong ứng dụng Web API, giúp để bảo trì và mở rộng.",
    sections: [
      {
        id: "section-1-1",
        title: "Sơ đồ Kiến trúc",
        content:
          "Kiến trúc 3 lớp là mô hình thiết kế phổ biến nhất trong phát triển ứng dụng Web API. Nó chia ứng dụng thành ba lớp chính:\n\n1. Presentation Layer (Lớp Trình bày): Xử lý giao diện người dùng và nhận yêu cầu từ client\n2. Logic Layer (Lớp Logic): Xử lý logic nghiệp vụ và các quy tắc ứng dụng\n3. Data Layer (Lớp Dữ liệu): Quản lý truy cập dữ liệu và cơ sở dữ liệu",
      },
      {
        id: "section-1-2",
        title: "Presentation Layer - Controllers",
        content:
          "Lớp Presentation chịu trách nhiệm:\n\n• Nhận HTTP request từ client (browser hoặc ứng dụng mobile)\n• Xác thực dữ liệu đầu vào\n• Gọi các service từ Logic Layer\n• Trả về HTTP response với dữ liệu hoặc lỗi\n\nControllers là các class hoặc function xử lý các endpoint API. Chúng không chứa logic nghiệp vụ phức tạp, chỉ điều phối các request đến các service thích hợp.",
        code: `@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody CreateUserRequest request) {
        UserDTO user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}`,
        codeLanguage: "Java",
      },
      {
        id: "section-1-3",
        title: "Logic Layer - Services",
        content:
          "Lớp Logic chứa toàn bộ logic nghiệp vụ của ứng dụng:\n\n• Xác thực quy tắc kinh doanh\n• Xử lý các phép tính phức tạp\n• Gọi các repository để truy cập dữ liệu\n• Quản lý transaction\n• Xử lý các ngoại lệ\n\nServices là các class chứa logic nghiệp vụ. Chúng độc lập với Controller và Data Layer, giúp code dễ test và tái sử dụng.",
        code: `@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        return convertToDTO(user);
    }
    
    public UserDTO createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encodePassword(request.getPassword()));
        
        return convertToDTO(userRepository.save(user));
    }
}`,
        codeLanguage: "Java",
      },
      {
        id: "section-1-4",
        title: "Data Layer - Repositories",
        content:
          "Lớp Data quản lý toàn bộ truy cập dữ liệu:\n\n• Kết nối với cơ sở dữ liệu\n• Thực hiện các truy vấn CRUD\n• Ánh xạ dữ liệu từ database sang object\n• Quản lý connection pool\n\nRepositories cung cấp interface để truy cập dữ liệu. Chúng ẩn đi chi tiết về cách dữ liệu được lưu trữ.",
        code: `@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT u FROM User u WHERE u.createdAt >= :startDate")
    List<User> findRecentUsers(@Param("startDate") LocalDateTime startDate);
}`,
        codeLanguage: "Java",
      },
    ],
  },
  {
    id: "chapter-2",
    number: 2,
    title: "Chiến lược truy cập dữ liệu với EF Core",
    description:
      "Tìm hiểu cách sử dụng Entity Framework Core để truy cập dữ liệu một cách hiệu quả và an toàn.",
    sections: [
      {
        id: "section-2-1",
        title: "DbContext và DbSet",
        content:
          "DbContext là lớp chính trong Entity Framework Core, đại diện cho một session làm việc với cơ sở dữ liệu. DbSet là collection của các entity trong cơ sở dữ liệu.\n\nDbContext theo dõi tất cả các thay đổi của entities và có thể persist chúng xuống database khi cần.",
        code: `public class ApplicationDbContext : DbContext {
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Product> Products { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        optionsBuilder.UseSqlServer("Server=.;Database=MyApp;Trusted_Connection=true;");
    }
}`,
        codeLanguage: "C#",
      },
      {
        id: "section-2-2",
        title: "CRUD Operations với EF Core",
        content:
          "Entity Framework Core cung cấp các phương thức CRUD cơ bản:\n\n• Create: Thêm entity mới vào database\n• Read: Truy vấn dữ liệu từ database\n• Update: Cập nhật entity đã tồn tại\n• Delete: Xóa entity khỏi database",
        code: `// Create
var user = new User { Name = "John", Email = "john@example.com" };
context.Users.Add(user);
await context.SaveChangesAsync();

// Read
var user = await context.Users.FindAsync(1);
var users = await context.Users.Where(u => u.Name.Contains("John")).ToListAsync();

// Update
user.Name = "John Doe";
await context.SaveChangesAsync();

// Delete
context.Users.Remove(user);
await context.SaveChangesAsync();`,
        codeLanguage: "C#",
      },
    ],
  },
  {
    id: "chapter-3",
    number: 3,
    title: "Tối ưu hóa API với DTO & AutoMapper",
    description:
      "Học cách sử dụng Data Transfer Objects để tối ưu hóa truyền dữ liệu giữa các lớp.",
    sections: [
      {
        id: "section-3-1",
        title: "Data Transfer Objects (DTO)",
        content:
          "DTO là các class được sử dụng để truyền dữ liệu giữa các lớp. Chúng giúp:\n\n• Giảm dữ liệu được truyền đi (chỉ gửi những field cần thiết)\n• Ẩn cấu trúc nội bộ của entity\n• Tăng bảo mật bằng cách không expose trực tiếp entity\n• Dễ dàng thay đổi API mà không ảnh hưởng đến database",
        code: `// Entity
public class User {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public DateTime CreatedAt { get; set; }
}

// DTO
public class UserDTO {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}`,
        codeLanguage: "C#",
      },
      {
        id: "section-3-2",
        title: "AutoMapper Configuration",
        content:
          "AutoMapper giúp tự động map properties giữa các objects có cấu trúc tương tự. Điều này giảm thiểu code boilerplate và tránh lỗi khi copy dữ liệu.",
        code: `// Configuration
public class MappingProfile : Profile {
    public MappingProfile() {
        CreateMap<User, UserDTO>();
        CreateMap<UserDTO, User>();
        CreateMap<User, UserDetailDTO>()
            .ForMember(dest => dest.FullName, 
                opt => opt.MapFrom(src => src.Name));
    }
}

// Usage
var mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>()));
var dto = mapper.Map<UserDTO>(user);`,
        codeLanguage: "C#",
      },
    ],
  },
  {
    id: "chapter-4",
    number: 4,
    title: "Authentication & Authorization",
    description:
      "Tìm hiểu cách xác thực và phân quyền người dùng trong ứng dụng Web API.",
    sections: [
      {
        id: "section-4-1",
        title: "JWT Authentication",
        content:
          "JSON Web Token (JWT) là một chuẩn mở để truyền thông tin an toàn giữa các bên dưới dạng JSON. JWT thường được sử dụng cho:\n\n• Xác thực người dùng (Authentication)\n• Truyền thông tin giữa các service\n• Authorization (Phân quyền)",
        code: `public class JwtService {
    public string GenerateToken(User user) {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]));
        var credentials = new SigningCredentials(
            key, SecurityAlgorithms.HmacSha256);
        
        var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };
        
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}`,
        codeLanguage: "C#",
      },
      {
        id: "section-4-2",
        title: "Role-Based Authorization",
        content:
          "Authorization xác định người dùng được phép làm gì sau khi đã xác thực. ASP.NET Core hỗ trợ:\n\n• Role-based authorization\n• Claim-based authorization\n• Policy-based authorization",
        code: `[Authorize(Roles = "Admin")]
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteUser(int id) {
    // Chỉ Admin mới có thể xóa user
    var user = await _context.Users.FindAsync(id);
    if (user == null) return NotFound();
    
    _context.Users.Remove(user);
    await _context.SaveChangesAsync();
    return NoContent();
}

// Policy-based
[Authorize(Policy = "RequireAdmin")]
public class AdminController : ControllerBase { }`,
        codeLanguage: "C#",
      },
    ],
  },
  {
    id: "chapter-5",
    number: 5,
    title: "API Versioning & Documentation",
    description:
      "Học cách quản lý các phiên bản API và viết tài liệu API chuyên nghiệp.",
    sections: [
      {
        id: "section-5-1",
        title: "API Versioning Strategies",
        content:
          "Khi API cần thay đổi mà không muốn break existing clients, chúng ta cần versioning. Các chiến lược phổ biến:\n\n• URL Path versioning: /api/v1/users\n• Query string versioning: /api/users?version=1\n• Header versioning: Accept: version=1\n• Media type versioning: Accept: application/vnd.api.v1+json",
        code: `[ApiVersion("1.0")]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class UsersController : ControllerBase {
    
    [HttpGet]
    [MapToApiVersion("1.0")]
    public ActionResult<IEnumerable<string>> GetV1() {
        return Ok(new[] { "User1", "User2" });
    }
    
    [HttpGet]
    [MapToApiVersion("2.0")]
    public ActionResult<IEnumerable<UserDTO>> GetV2() {
        // Return detailed user info for v2
        return Ok(_users.Select(u => new UserDTO(u)));
    }
}`,
        codeLanguage: "C#",
      },
      {
        id: "section-5-2",
        title: "Swagger/OpenAPI Documentation",
        content:
          "Swagger (OpenAPI) giúp tự động tạo tài liệu API và giao diện test. Đây là công cụ không thể thiếu cho REST API.",
        code: `// Program.cs
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new OpenApiInfo {
        Title = "My API",
        Version = "v1",
        Description = "A simple API for demonstration"
    });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
});

// Controller annotation
[Produces("application/json")]
[ApiController]
public class UsersController : ControllerBase {
    
    /// <summary>
    /// Get all users
    /// </summary>
    /// <returns>List of users</returns>
    [HttpGet]
    [ProducesResponseType(typeof(User[]), 200)]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers() {
        return await _context.Users.ToListAsync();
    }
}`,
        codeLanguage: "C#",
      },
    ],
  },
  {
    id: "chapter-6",
    number: 6,
    title: "Error Handling & Validation",
    description:
      "Tìm hiểu cách xử lý lỗi và validation dữ liệu một cách chuyên nghiệp.",
    sections: [
      {
        id: "section-6-1",
        title: "Global Exception Handling",
        content:
          "Global exception handling giúp xử lý tất cả các lỗi không mong muốn tại một nơi duy nhất, đảm bảo response format nhất quán cho client.",
        code: `public class GlobalExceptionHandler : IExceptionHandler {
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken) {
        
        var (statusCode, message) = exception switch {
            UserNotFoundException => (404, exception.Message),
            ValidationException => (400, exception.Message),
            UnauthorizedAccessException => (401, "Unauthorized"),
            _ => (500, "An error occurred processing your request")
        };
        
        var response = new ErrorResponse {
            Message = message,
            TraceId = httpContext.TraceIdentifier
        };
        
        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(response);
        
        return true;
    }
}`,
        codeLanguage: "C#",
      },
      {
        id: "section-6-2",
        title: "Data Validation",
        content:
          "Validation đảm bảo dữ liệu đầu vào hợp lệ trước khi xử lý. ASP.NET Core hỗ trợ Data Annotations và FluentValidation.",
        code: `// Data Annotations
public class CreateUserRequest {
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; }
    
    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; }
    
    [Range(1, 120)]
    public int Age { get; set; }
}

// FluentValidation
public class CreateUserValidator : AbstractValidator<CreateUserRequest> {
    public CreateUserValidator() {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email");
        
        RuleFor(x => x.Password)
            .MinimumLength(6).WithMessage("Password must be at least 6 characters");
    }
}`,
        codeLanguage: "C#",
      },
    ],
  },
  {
    id: "chapter-7",
    number: 7,
    title: "Caching Strategies",
    description:
      "Tìm hiểu các chiến lược caching để tối ưu hiệu suất API.",
    sections: [
      {
        id: "section-7-1",
        title: "In-Memory Caching",
        content:
          "In-memory caching lưu trữ dữ liệu trong RAM của server. Đây là cách đơn giản và nhanh nhất để cache dữ liệu.",
        code: `public class ProductService {
    private readonly IMemoryCache _cache;
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);
    
    public async Task<ProductDTO> GetProduct(int id) {
        var cacheKey = $"product_{id}";
        
        if (_cache.TryGetValue(cacheKey, out ProductDTO cached)) {
            return cached;
        }
        
        var product = await _context.Products.FindAsync(id);
        var dto = _mapper.Map<ProductDTO>(product);
        
        _cache.Set(cacheKey, dto, CacheDuration);
        return dto;
    }
}`,
        codeLanguage: "C#",
      },
      {
        id: "section-7-2",
        title: "Response Caching",
        content:
          "Response caching cho phép browser hoặc proxy server cache entire HTTP responses, giảm tải cho server.",
        code: `// Enable response caching
builder.Services.AddResponseCaching();

// Configure middleware
app.UseResponseCaching();

// Controller with cache profile
[HttpGet]
[ResponseCache(Duration = 60, VaryByQueryKeys = new[] { "page", "size" })]
public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
    [FromQuery] int page = 1,
    [FromQuery] int size = 10) {
    
    return await _context.Products
        .Skip((page - 1) * size)
        .Take(size)
        .ToListAsync();
}`,
        codeLanguage: "C#",
      },
    ],
  },
  {
    id: "chapter-8",
    number: 8,
    title: "Logging & Monitoring",
    description:
      "Thiết lập logging và monitoring để theo dõi sức khỏe của ứng dụng.",
    sections: [
      {
        id: "section-8-1",
        title: "Structured Logging",
        content:
          "Structured logging lưu trữ log dưới dạng key-value pairs, giúp dễ dàng query và phân tích. Sử dụng Serilog để implement.",
        code: `// Program.cs
builder.Logging.ClearProviders();
builder.Host.UseSerilog((ctx, lc) => lc
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/app-.log", rollingInterval: RollingInterval.Day));

// Usage
public class UserService {
    private readonly ILogger<UserService> _logger;
    
    public async Task<User> CreateUserAsync(CreateUserRequest request) {
        _logger.LogInformation(
            "Creating user with email {Email} at {Time}",
            request.Email,
            DateTime.UtcNow);
        
        try {
            var user = await _repository.CreateAsync(request);
            _logger.LogInformation("User {UserId} created successfully", user.Id);
            return user;
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Failed to create user {Email}", request.Email);
            throw;
        }
    }
}`,
        codeLanguage: "C#",
      },
      {
        id: "section-8-2",
        title: "Health Checks",
        content:
          "Health checks giúp Kubernetes và các công cụ orchestration theo dõi trạng thái của ứng dụng.",
        code: `// Program.cs
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database")
    .AddCheck("external-api", () => {
        // Check external service availability
        return HealthCheckResult.Healthy();
    });

// Custom health check
public class DatabaseHealthCheck : IHealthCheck {
    private readonly AppDbContext _context;
    
    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default) {
        
        try {
            return Task.FromResult(
                _context.Database.CanConnect()
                    ? HealthCheckResult.Healthy()
                    : HealthCheckResult.Unhealthy("Cannot connect to database"));
        }
        catch (Exception ex) {
            return Task.FromResult(
                HealthCheckResult.Unhealthy(ex.Message));
        }
    }
}`,
        codeLanguage: "C#",
      },
    ],
  },
  {
    id: "chapter-9",
    number: 9,
    title: "API Security Best Practices",
    description:
      "Bảo mật API với các best practices được khuyến nghị.",
    sections: [
      {
        id: "section-9-1",
        title: "Rate Limiting",
        content:
          "Rate limiting bảo vệ API khỏi bị abuse và DDoS attacks. ASP.NET 7+ có built-in rate limiting support.",
        code: `// Program.cs
builder.Services.AddRateLimiter(options => {
    options.RejectionStatusCode = StatusCodes.TooManyRequests;
    
    options.AddFixedWindowLimiter("fixed", opt => {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 10;
    });
    
    options.AddSlidingWindowLimiter("sliding", opt => {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.SegmentsPerWindow = 5;
    });
});

// Usage
[EnableRateLimiting("fixed")]
[ApiController]
public class UsersController : ControllerBase { }`,
        codeLanguage: "C#",
      },
      {
        id: "section-9-2",
        title: "CORS Configuration",
        content:
          "CORS (Cross-Origin Resource Sharing) kiểm soát các domain nào được phép truy cập API từ browser.",
        code: `// Program.cs
builder.Services.AddCors(options => {
    options.AddPolicy("AllowFrontend", policy => {
        policy.WithOrigins("https://myfrontend.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("X-Total-Count");
    });
    
    options.AddPolicy("AllowMobile", policy => {
        policy.WithOrigins("myapp://")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

app.UseCors("AllowFrontend");`,
        codeLanguage: "C#",
      },
    ],
  },
  {
    id: "chapter-10",
    number: 10,
    title: "Testing & CI/CD",
    description:
      "Viết unit tests và thiết lập CI/CD pipeline cho API.",
    sections: [
      {
        id: "section-10-1",
        title: "Unit Testing với xUnit",
        content:
          "xUnit là framework testing phổ biến nhất cho .NET. Viết tests giúp đảm bảo code hoạt động đúng và refactor an toàn.",
        code: `public class UserServiceTests {
    private readonly Mock<IUserRepository> _repository;
    private readonly UserService _service;
    
    public UserServiceTests() {
        _repository = new Mock<IUserRepository>();
        _service = new UserService(_repository.Object);
    }
    
    [Fact]
    public async Task GetUserById_ExistingUser_ReturnsUser() {
        // Arrange
        var userId = 1;
        var user = new User { Id = userId, Name = "Test" };
        _repository.Setup(r => r.FindAsync(userId))
            .ReturnsAsync(user);
        
        // Act
        var result = await _service.GetUserById(userId);
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.Id);
    }
    
    [Fact]
    public async Task GetUserById_NonExistingUser_ThrowsException() {
        // Arrange
        _repository.Setup(r => r.FindAsync(It.IsAny<int>()))
            .ReturnsAsync((User?)null);
        
        // Act & Assert
        await Assert.ThrowsAsync<UserNotFoundException>(
            () => _service.GetUserById(999));
    }
}`,
        codeLanguage: "C#",
      },
      {
        id: "section-10-2",
        title: "GitHub Actions CI/CD",
        content:
          "GitHub Actions tự động chạy tests và deploy khi có code changes. Đây là cách setup basic CI/CD pipeline.",
        code: `# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v4
      with:
        dotnet-version: '8.0.x'
    
    - name: Restore dependencies
      run: dotnet restore
    
    - name: Build
      run: dotnet build --no-restore
    
    - name: Test
      run: dotnet test --no-build --verbosity normal
    
    - name: Publish
      if: github.ref == 'refs/heads/main'
      run: dotnet publish -c Release -o ./publish
    
    - name: Deploy to Azure
      if: github.ref == 'refs/heads/main'
      uses: azure/webapps-deploy@v3
      with:
        app-name: 'my-api'
        publish-profile: \${{ secrets.AZURE_PUBLISH_PROFILE }}`,
        codeLanguage: "YAML",
      },
    ],
  },
];

/** Cuộn tới khối nội dung bài (sau khi đổi chương từ sidebar / nút) */
function scrollToChapterContent() {
  const el = document.getElementById("chapter-content");
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const top = window.scrollY + rect.top - 80; // trừ chiều cao sidebar/menu
  window.scrollTo({ top, behavior: "smooth" });
}

export default function Home() {
  const [activeChapterId, setActiveChapterId] = useState(chapters[0].id);
  const [showContent, setShowContent] = useState(true);

  const activeChapter = chapters.find((c) => c.id === activeChapterId);
  const currentIndex = chapters.findIndex((c) => c.id === activeChapterId);

  /** Đổi chương rồi cuộn xuống bài tương ứng */
  const switchChapterAndScroll = useCallback((id: string) => {
    setShowContent(false);
    setTimeout(() => {
      setActiveChapterId(id);
      setShowContent(true);
      // Đợi layout render xong rồi mới scroll (AnimatePresence ~200ms)
      setTimeout(scrollToChapterContent, 80);
    }, 200);
  }, []);

  const courses = [
    {
      id: "course-1",
      title: "Nội dung khóa học",
      chapters: chapters.map((ch) => ({
        id: ch.id,
        number: ch.number,
        title: ch.title,
      })),
    },
  ];

  const handlePrevChapter = () => {
    if (currentIndex > 0) {
      switchChapterAndScroll(chapters[currentIndex - 1].id);
    }
  };

  const handleNextChapter = () => {
    if (currentIndex < chapters.length - 1) {
      switchChapterAndScroll(chapters[currentIndex + 1].id);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Gradient Background */}
      <div className="fixed inset-0 gradient-bg pointer-events-none" />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Sidebar trái + nội dung: desktop song song, mobile drawer */}
      <div className="relative z-10 flex min-h-screen w-full flex-col md:flex-row">
        <div id="course-sidebar" className="z-30 md:shrink-0">
          <Sidebar
            courses={courses}
            activeChapterId={activeChapterId}
            onChapterSelect={switchChapterAndScroll}
          />
        </div>

        {/* Main Content Area */}
        <main className="relative z-10 min-h-screen min-w-0 flex-1 w-full">
        {/* Hero Section */}
        <HeroSection />

        {/* Content Section */}
        <div className="relative px-4 md:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            {/* Stats Bar */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { icon: BookOpen, label: "Tổng Chương", value: chapters.length },
                { icon: Trophy, label: "Hoàn thành", value: 1 },
                { icon: Target, label: "Mục tiêu", value: 10 },
                { icon: Clock, label: "Giờ học", value: 25 },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-2xl glass"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-display gradient-text">{stat.value}+</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-300">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Chapter Content */}
            <div
              id="chapter-content"
              className="scroll-mt-24 md:scroll-mt-8"
            >
              <AnimatePresence mode="wait">
                {showContent && activeChapter && (
                  <motion.div
                    key={activeChapter.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ChapterContent chapter={activeChapter} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Architecture Diagram */}
            <motion.div
              className="mt-16 md:mt-20 rounded-3xl glass shadow-card p-6 md:p-10 dark:border dark:border-white/12 dark:bg-zinc-900/40"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <ArchitectureDiagram
                title="Sơ đồ Kiến trúc"
                description="Mô hình 3 lớp trong Web API"
              />
            </motion.div>

            {/* Navigation Footer */}
            <motion.div
              className="mt-16 md:mt-20 pt-8 border-t border-border/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-zinc-600 dark:text-zinc-300">
                  <span className="font-bold text-zinc-900 dark:text-zinc-50">
                    {activeChapter?.number}
                  </span>
                  <span className="mx-1">/</span>
                  <span>{chapters.length}</span>
                  <span className="ml-2 text-xs opacity-80">chương</span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={handlePrevChapter}
                    disabled={currentIndex === 0}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-2xl font-medium
                      transition-all duration-300
                      ${currentIndex === 0
                        ? "opacity-50 cursor-not-allowed bg-secondary"
                        : "glass hover:shadow-glow"
                      }
                    `}
                    whileHover={currentIndex !== 0 ? { scale: 1.02, x: -4 } : {}}
                    whileTap={currentIndex !== 0 ? { scale: 0.98 } : {}}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Chương trước</span>
                  </motion.button>

                  <motion.button
                    onClick={handleNextChapter}
                    disabled={currentIndex === chapters.length - 1}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-2xl font-bold
                      transition-all duration-300
                      ${currentIndex === chapters.length - 1
                        ? "opacity-50 cursor-not-allowed bg-secondary"
                        : "gradient-primary text-white shadow-glow hover:shadow-xl"
                      }
                    `}
                    whileHover={currentIndex !== chapters.length - 1 ? { scale: 1.02, x: 4 } : {}}
                    whileTap={currentIndex !== chapters.length - 1 ? { scale: 0.98 } : {}}
                  >
                    <span className="hidden sm:inline">Chương sau</span>
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.footer
              className="mt-20 py-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm">ByteByteGo System Design Masterclass</span>
              </div>
              <p className="text-xs text-muted-foreground/60 mt-2">
                © 2024 - Nền tảng học tập System Design hàng đầu
              </p>
            </motion.footer>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
