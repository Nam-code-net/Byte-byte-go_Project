import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChapterContent from "@/components/ChapterContent";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import HeroSection from "@/components/HeroSection";
import { motion } from "framer-motion";

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
        // Validate business rules
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encodePassword(request.getPassword()));
        
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
}`,
        codeLanguage: "Java",
      },
      {
        id: "section-1-4",
        title: "Data Layer - Repositories",
        content:
          "Lớp Data quản lý toàn bộ truy cập dữ liệu:\n\n• Kết nối với cơ sở dữ liệu\n• Thực hiện các truy vấn CRUD\n• Ánh xạ dữ liệu từ database sang object\n• Quản lý connection pool\n\nRepositories cung cấp interface để truy cập dữ liệu. Chúng ẩn đi chi tiết về cách dữ liệu được lưu trữ, cho phép dễ dàng thay đổi cơ sở dữ liệu mà không ảnh hưởng đến các lớp khác.",
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
          "DbContext là lớp chính trong Entity Framework Core, đại diện cho một session làm việc với cơ sở dữ liệu. DbSet là collection của các entity trong cơ sở dữ liệu.",
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
    ],
  },
];

export default function Home() {
  const [activeChapterId, setActiveChapterId] = useState(chapters[0].id);

  const activeChapter = chapters.find((c) => c.id === activeChapterId);

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

  return (
    <div className="relative flex min-h-screen bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/4 -right-24 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* Sidebar */}
      <div id="course-sidebar" className="relative z-20">
        <Sidebar
          courses={courses}
          activeChapterId={activeChapterId}
          onChapterSelect={setActiveChapterId}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto md:ml-0">
        {/* Hero Banner */}
        <HeroSection />

        {/* Content Area */}
        <motion.div
          id="chapter-content"
          className="px-4 md:px-8 py-10 md:py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {activeChapter && (
            <>
              <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-xl p-4 md:p-8">
                <ChapterContent chapter={activeChapter} />
              </div>

              {/* Architecture Diagram */}
              <motion.div
                className="mt-16 md:mt-20 rounded-2xl border border-border/60 bg-card/70 p-4 md:p-8 shadow-lg"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <ArchitectureDiagram
                  title="Sơ đồ Kiến trúc"
                  description="Mô hình 3 lớp trong Web API"
                />
              </motion.div>

              {/* Footer Navigation */}
              <motion.div
                className="mt-16 md:mt-20 pt-8 border-t border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                  <div className="text-sm text-muted-foreground">
                    Chương {activeChapter.number} / {chapters.length}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {activeChapter.number > 1 && (
                      <motion.button
                        onClick={() => {
                          const prevChapter = chapters[activeChapter.number - 2];
                          setActiveChapterId(prevChapter.id);
                        }}
                        className="px-6 py-2 rounded-lg border border-border hover:bg-accent/10 transition-colors font-medium"
                        whileHover={{ scale: 1.05, x: -4 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ← Chương trước
                      </motion.button>
                    )}
                    {activeChapter.number < chapters.length && (
                      <motion.button
                        onClick={() => {
                          const nextChapter = chapters[activeChapter.number];
                          setActiveChapterId(nextChapter.id);
                        }}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg transition-all font-medium"
                        whileHover={{ scale: 1.05, x: 4 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Chương sau →
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
