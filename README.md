# Vocabulary Builder App - Ứng Dụng Học Từ Vựng

## 📋 Tổng Quan Dự Án

Đây là ứng dụng web full-stack để quản lý và học từ vựng ba ngôn ngữ: **Tiếng Anh**, **Tiếng Đức**, và **Tiếng Việt**. Ứng dụng được xây dựng với kiến trúc tách biệt giữa Frontend (Vue.js) và Backend (Node.js + Express + MongoDB).

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐    MongoDB    ┌─────────────────┐
│   Frontend      │◄──────────────────►│    Backend      │◄─────────────►│    Database     │
│   (Vue.js)      │                     │ (Node.js/Express)│               │   (MongoDB)     │
│   Port: 8080    │                     │   Port: 3000    │               │                 │
└─────────────────┘                     └─────────────────┘               └─────────────────┘
```

## 📁 Cấu Trúc Thư Mục

```
COMP-1842/
├── front-end/                  # Frontend Vue.js Application
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/
│   │   ├── App.vue            # Component gốc
│   │   ├── main.js            # Entry point
│   │   ├── router.js          # Cấu hình routing
│   │   ├── assets/            # Tài nguyên tĩnh
│   │   ├── components/        # Components tái sử dụng
│   │   │   ├── WordForm.vue   # Form thêm/sửa từ
│   │   │   └── VocabTest.vue  # Component test (chưa implement)
│   │   ├── helpers/           # Utilities và API calls
│   │   │   └── helpers.js     # API functions
│   │   └── views/             # Các trang chính
│   │       ├── Words.vue      # Danh sách từ vựng
│   │       ├── Show.vue       # Xem chi tiết từ
│   │       ├── Edit.vue       # Chỉnh sửa từ
│   │       ├── New.vue        # Thêm từ mới
│   │       └── Test.vue       # Trang test (chưa implement)
│   ├── package.json
│   └── jsconfig.json
└── server/                     # Backend Node.js Application
    ├── api/
    │   ├── controllers/
    │   │   └── vocabController.js  # Business logic
    │   ├── models/
    │   │   └── vocabModel.js       # MongoDB Schema
    │   └── routes/
    │       └── vocabRoutes.js      # API endpoints
    ├── server.js              # Entry point server
    └── package.json
```

## 🔧 Công Nghệ Sử Dụng

### Frontend:
- **Vue.js 2.6.14** - Progressive JavaScript Framework
- **Vue Router 3.6.5** - Client-side routing
- **Axios 1.10.0** - HTTP client cho API calls
- **Semantic UI CSS 2.5.0** - UI Framework
- **Vue Flash Message 0.7.2** - Thông báo flash messages

### Backend:
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **MongoDB** - NoSQL Database (MongoDB Atlas)
- **Mongoose 6.2.4** - MongoDB ODM
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **Body-Parser 2.2.0** - Parsing middleware

## 🚀 Cách Chạy Ứng Dụng

### Yêu Cầu Hệ Thống:
- Node.js (>= 14.x)
- npm hoặc yarn
- Kết nối internet (để kết nối MongoDB Atlas)

### 1. Chạy Backend Server:
```bash
cd server
npm install
npm start
# Server sẽ chạy trên http://localhost:3000
```

### 2. Chạy Frontend:
```bash
cd front-end
npm install
npm run serve
# Frontend sẽ chạy trên http://localhost:8080
```

## 📊 Database Schema

### Vocab Collection (MongoDB):
```javascript
{
  _id: ObjectId,
  english: String (required),    // Từ tiếng Anh
  german: String (required),     // Từ tiếng Đức  
  vietnamese: String (required)  // Từ tiếng Việt
}
```

## 🌐 API Endpoints

| Method | Endpoint | Mô Tả | Controller Function |
|--------|----------|-------|-------------------|
| GET | `/words` | Lấy tất cả từ vựng | `list_all_words` |
| POST | `/words` | Tạo từ mới | `create_a_word` |
| GET | `/words/:id` | Lấy từ theo ID | `read_a_word` |
| PUT | `/words/:id` | Cập nhật từ theo ID | `update_a_word` |
| DELETE | `/words/:id` | Xóa từ theo ID | `delete_a_word` |

## 🔄 Vòng Đời Các Chức Năng

### 1. 🏠 **HIỂN THỊ DANH SÁCH TỪ VỰNG** (Trang chủ `/words`)

**🔄 Flow:**
```
User truy cập / → Router redirect → /words → Words.vue → API Call → Database
```

**📋 Chi tiết các bước:**

1. **Router (router.js)**:
   - User truy cập `/` → tự động redirect sang `/words`
   - Route `/words` load component `Words.vue`
   ```javascript
   {
       path: '/',             
       redirect: '/words'     // Redirect tự động
   },
   {
       path: '/words',        
       name: 'words',         
       component: Words       // Load Words.vue component
   }
   ```

2. **Words.vue Component**:
   - `mounted()` lifecycle: Gọi `api.getWords()`
   - Hiển thị data trong table với Semantic UI
   - Mỗi hàng có 3 action: Show, Edit, Delete
   ```javascript
   async mounted() {
       this.words = await api.getWords();  // Fetch data khi component mount
   }
   ```
   ```html
   <tr v-for="(word, i) in words" :key="i">
       <td>{{ word.english }}</td>
       <td>{{ word.german }}</td>
       <td>{{ word.vietnamese }}</td>
       <td><router-link :to="{ name: 'show', params: { id: word._id } }">Show</router-link></td>
       <td><router-link :to="{ name: 'edit', params: { id: word._id } }">Edit</router-link></td>
       <td @click.prevent="onDestroy(word._id)">Destroy</td>
   </tr>
   ```

3. **API Helper (helpers.js)**:
   - `getWords()` → GET request tới `/words`
   - Error handling với flash message
   ```javascript
   getWords: handleError(async () => {
       const res = await axios.get(baseURL);  // GET http://localhost:3000/words/
       return res.data;
   })
   ```

4. **Backend Route (vocabRoutes.js)**:
   - GET `/words` → `vocabController.list_all_words`
   ```javascript
   app.route('/words')
       .get(vocabController.list_all_words)  // Handle GET request
   ```

5. **Controller (vocabController.js)**:
   - `list_all_words()`: `Vocab.find({})` lấy tất cả documents
   - Trả về JSON array
   ```javascript
   exports.list_all_words = (req, res) => {
       Vocab.find({}, (err, words) => {     // Query tất cả documents
           if (err) res.send(err);
           res.json(words);                 // Return JSON array
       });
   };
   ```

6. **Database**:
   - MongoDB query trên collection `vocab`
   - Trả về tất cả records

**🎯 Kết quả:** Hiển thị bảng danh sách từ vựng với đầy đủ thông tin và actions

---

### 2. ➕ **THÊM TỪ MỚI** (`/words/new`)

**🔄 Flow:**
```
User click "New" → New.vue → WordForm.vue → Submit → API Call → Database → Redirect
```

**📋 Chi tiết các bước:**

1. **Navigation**: User click "New" trong navbar → Router load `New.vue`
   ```html
   <router-link to="/words/new" class="item">
       <i class="plus circle icon"></i> New
   </router-link>
   ```

2. **New.vue Component**:
   - Render `WordForm` component
   - Listen event `createOrUpdate` từ form
   ```html
   <word-form @createOrUpdate="createOrUpdate"></word-form>
   ```
   ```javascript
   components: {
       'word-form': WordForm  // Register WordForm component
   }
   ```

3. **WordForm.vue Component**:
   - Form có 3 input: English, German, Vietnamese
   - Two-way binding với `v-model`
   - Validation: Kiểm tra English và German không được rỗng
   - Submit → emit event `createOrUpdate`
   ```html
   <form @submit.prevent="onSubmit">
       <input type="text" v-model="word.german" />
       <input type="text" v-model="word.english" />
       <input type="text" v-model="word.vietnamese" />
       <button class="positive ui button">Submit</button>
   </form>
   ```
   ```javascript
   onSubmit: function () {
       if (this.word.english === '' || this.word.german === '') {
           this.errorsPresent = true;  // Validation failed
       } else {
           this.$emit('createOrUpdate', this.word);  // Emit to parent
       }
   }
   ```

4. **New.vue Methods**:
   - `createOrUpdate()` nhận word object → gọi `api.createWord(word)`
   - Flash success message + Redirect
   ```javascript
   createOrUpdate: async function (word) {
       const res = await api.createWord(word);        // API call
       this.flash('Word created', 'success');         // Success message
       this.$router.push(`/words/${res._id}`);        // Redirect to detail
   }
   ```

5. **API Helper**:
   - `createWord()` → POST request tới `/words` với payload
   ```javascript
   createWord: handleError(async payload => {
       const res = await axios.post(baseURL, payload);  // POST to /words/
       return res.data;
   })
   ```

6. **Backend Route**: POST `/words` → `vocabController.create_a_word`
   ```javascript
   app.route('/words')
       .post(vocabController.create_a_word);  // Handle POST request
   ```

7. **Controller**:
   - `create_a_word()`: Tạo `new Vocab(req.body)` → `save()`
   - Trả về word object mới với `_id`
   ```javascript
   exports.create_a_word = (req, res) => {
       const newWord = new Vocab(req.body);  // Create new document
       newWord.save((err, word) => {         // Save to database
           if (err) res.send(err);
           res.json(word);                   // Return saved word with _id
       });
   };
   ```

8. **Database**: Insert document mới vào collection `vocab`

**🎯 Kết quả:** Từ mới được thêm vào database và user được chuyển đến trang detail

---

### 3. 👁️ **XEM CHI TIẾT TỪ** (`/words/:id`)

**🔄 Flow:**
```
User click "Show" → Show.vue → API Call → Database → Display readonly form
```

**📋 Chi tiết các bước:**

1. **Navigation**: User click "Show" link với ID cụ thể → Router load `Show.vue`
   ```html
   <router-link :to="{ name: 'show', params: { id: word._id } }">Show</router-link>
   ```
   ```javascript
   {
       path: '/words/:id',    // Dynamic route with ID parameter
       name: 'show',
       component: Show
   }
   ```

2. **Show.vue Component**:
   - `mounted()`: Lấy ID từ `this.$route.params.id` → gọi `api.getWord(id)`
   - Hiển thị 3 readonly inputs với flags của quốc gia
   - Link "Edit word" dẫn đến trang edit
   ```javascript
   async mounted() {
       this.word = await api.getWord(this.$route.params.id);  // Get word by ID
   }
   ```
   ```html
   <div class="ui labeled input fluid">
       <div class="ui label"><i class="germany flag"></i> German</div>
       <input type="text" readonly :value="word.german" />
   </div>
   <router-link :to="{ name: 'edit', params: { id: this.$route.params.id } }">
       Edit word
   </router-link>
   ```

3. **API Helper**: `getWord(id)` → GET request tới `/words/${id}`
   ```javascript
   getWord: handleError(async id => {
       const res = await axios.get(baseURL + id);  // GET /words/:id
       return res.data;
   })
   ```

4. **Backend Route**: GET `/words/:id` → `vocabController.read_a_word`
   ```javascript
   app.route('/words/:wordId')
       .get(vocabController.read_a_word)  // Handle GET with ID param
   ```

5. **Controller**: `read_a_word()`: `Vocab.findById(req.params.wordId)`
   ```javascript
   exports.read_a_word = (req, res) => {
       Vocab.findById(req.params.wordId, (err, word) => {  // Find by MongoDB _id
           if (err) res.send(err);
           res.json(word);  // Return single word object
       });
   };
   ```

6. **Database**: Tìm document theo `_id`

**🎯 Kết quả:** Hiển thị chi tiết từ vựng ở dạng read-only với option edit

---

### 4. ✏️ **CHỈNH SỬA TỪ** (`/words/:id/edit`)

**🔄 Flow:**
```
User click "Edit" → Edit.vue → Load current data → WordForm.vue → Submit → API Call → Database → Redirect
```

**📋 Chi tiết các bước:**

1. **Navigation**: User click "Edit" → Router load `Edit.vue` với ID
   ```html
   <router-link :to="{ name: 'edit', params: { id: word._id } }">Edit</router-link>
   ```

2. **Edit.vue Component**:
   - `mounted()`: Load dữ liệu hiện tại + Pass prop cho WordForm
   - Listen event `createOrUpdate`
   ```javascript
   async mounted() {
       this.word = await api.getWord(this.$route.params.id);  // Load current data
   }
   ```
   ```html
   <word-form @createOrUpdate="createOrUpdate" :word="this.word"></word-form>
   ```

3. **WordForm.vue** (với data có sẵn):
   - Nhận prop `word` từ Edit.vue → Pre-fill form
   - User sửa đổi → Submit
   ```javascript
   props: {
       word: {
           type: Object,
           default: () => ({ english: '', german: '' })  // Default empty
       }
   }
   ```
   ```html
   <!-- Form được pre-filled với dữ liệu hiện tại -->
   <input type="text" v-model="word.german" />    <!-- Shows current German -->
   <input type="text" v-model="word.english" />   <!-- Shows current English -->
   <input type="text" v-model="word.vietnamese" /> <!-- Shows current Vietnamese -->
   ```

4. **Edit.vue Methods**:
   - `createOrUpdate()` → gọi `api.updateWord(word)` (word đã có `_id`)
   - Flash success + Redirect
   ```javascript
   createOrUpdate: async function (word) {
       await api.updateWord(word);                    // Update API call
       this.flash('Word updated successfully!', 'success');
       this.$router.push(`/words/${word._id}`);       // Redirect to detail page
   }
   ```

5. **API Helper**: `updateWord()` → PUT request với word._id
   ```javascript
   updateWord: handleError(async payload => {
       const res = await axios.put(baseURL + payload._id, payload);  // PUT /words/:id
       return res.data;
   })
   ```

6. **Backend Route**: PUT `/words/:id` → `vocabController.update_a_word`
   ```javascript
   app.route('/words/:wordId')
       .put(vocabController.update_a_word);  // Handle PUT request
   ```

7. **Controller**: Update document với option {new: true}
   ```javascript
   exports.update_a_word = (req, res) => {
       Vocab.findOneAndUpdate(
           { _id: req.params.wordId },    // Find criteria
           req.body,                      // Update data
           { new: true },                 // Return updated document
           (err, word) => {
               if (err) res.send(err);
               res.json(word);            // Return updated word
           }
       );
   };
   ```

8. **Database**: Update document theo `_id`

**🎯 Kết quả:** Từ được cập nhật và user được chuyển về trang detail

---

### 5. 🗑️ **XÓA TỪ** (Từ trang Words.vue)

**🔄 Flow:**
```
User click "Destroy" → Confirm dialog → API Call → Database → Remove from UI list
```

**📋 Chi tiết các bước:**

1. **User Action**: User click "Destroy" link → Prevent default + call delete method
   ```html
   <td @click.prevent="onDestroy(word._id)">
       <a :href="`/words/${word._id}`">Destroy</a>  <!-- Link prevented by @click.prevent -->
   </td>
   ```

2. **Words.vue Methods**: Confirm → Delete → Update UI
   ```javascript
   async onDestroy(id) {
       const sure = confirm('Are you sure?');         // Confirmation dialog
       if (!sure) return;                             // Cancel if not confirmed
       
       await api.deleteWord(id);                      // API call to delete
       this.flash('Word deleted successfully!', 'success');  // Success message
       
       const newWords = this.words.filter(word => word._id !== id);  // Remove from UI
       this.words = newWords;                         // Update local array
   }
   ```

3. **API Helper**: DELETE request tới backend
   ```javascript
   deleteWord: handleError(async id => {
       const res = await axios.delete(baseURL + id);  // DELETE /words/:id
       return res.data;                               // Return confirmation
   })
   ```

4. **Backend Route**: DELETE mapping tới controller
   ```javascript
   app.route('/words/:wordId')
       .delete(vocabController.delete_a_word);  // Handle DELETE request
   ```

5. **Controller**: Delete from MongoDB + Return success
   ```javascript
   exports.delete_a_word = (req, res) => {
       Vocab.deleteOne({ _id: req.params.wordId }, err => {  // Delete from DB
           if (err) res.send(err);
           res.json({                                         // Return success message
               message: 'Word successfully deleted',
               _id: req.params.wordId
           });
       });
   };
   ```

6. **Database**: Xóa document theo `_id`

**🎯 Kết quả:** Từ bị xóa khỏi database và UI được cập nhật ngay lập tức

---

## 🎨 UI/UX Features

### Navigation:
- **Semantic UI navbar** với 3 menu items: Words, New, Test
- **Router-link active class** để highlight trang hiện tại

### Flash Messages:
- **Success messages**: Khi tạo, sửa, xóa thành công
- **Error messages**: Khi có lỗi API hoặc validation
- **Auto-hide**: Tự động biến mất sau 3 giây
- **Pause on interact**: Dừng timer khi user tương tác

### Form Validation:
- **Required fields**: English và German bắt buộc
- **Real-time feedback**: Hiển thị lỗi ngay khi submit
- **User-friendly messages**: Thông báo rõ ràng, dễ hiểu

### Responsive Design:
- **Semantic UI responsive grid**
- **Fluid inputs**: Tự động điều chỉnh width
- **Mobile-friendly**: Hoạt động tốt trên mobile

## 🔐 Bảo Mật & Error Handling

### Frontend:
- **Axios interceptors** để handle lỗi HTTP
- **Higher-order function** `handleError` wrap tất cả API calls
- **Confirm dialogs** trước khi xóa
- **Input validation** trước khi gửi data

### Backend:
- **CORS enabled** cho cross-origin requests
- **Body parsing** an toàn với body-parser
- **Mongoose validation** ở schema level
- **404 handler** cho undefined routes
- **Error responses** consistent với status codes

### Database:
- **MongoDB Atlas** - Cloud database với security
- **Schema validation** với required fields
- **Connection string** với authentication

## 🚧 Các Tính Năng Chưa Hoàn Thành

1. **Test.vue**: Trang test từ vựng (file rỗng)
2. **VocabTest.vue**: Component test (file rỗng)
3. **Chức năng tìm kiếm**: Search/filter từ vựng
4. **Phân trang**: Pagination cho danh sách từ
5. **Categories**: Phân loại từ theo chủ đề
6. **Audio**: Phát âm từ vựng
7. **Statistics**: Thống kê học tập

## 🔄 Data Flow Summary

```
Frontend (Vue.js) ←→ API Helper (Axios) ←→ Backend Routes ←→ Controllers ←→ Models ←→ MongoDB
      ↓                    ↓                     ↓              ↓           ↓
   UI Components     HTTP Requests        Express Routes   Business Logic  Database
   Flash Messages    Error Handling       Middleware       Validation      Queries
   Form Validation   Response Parsing     CORS/BodyParser  Mongoose ODM    Schema
```

## 📝 Best Practices Được Áp Dụng

1. **Separation of Concerns**: Tách biệt UI, API, Business Logic, Database
2. **Component-based Architecture**: Tái sử dụng components (WordForm)
3. **RESTful API Design**: Consistent endpoints và HTTP methods
4. **Error Handling**: Comprehensive error handling ở mọi layer
5. **Code Organization**: Clear folder structure và naming conventions
6. **User Experience**: Flash messages, confirmations, redirects
7. **Responsive Design**: Mobile-friendly UI
8. **Validation**: Both client-side và server-side validation

Ứng dụng này demo một complete CRUD application với modern web technologies và best practices trong việc xây dựng full-stack applications.
