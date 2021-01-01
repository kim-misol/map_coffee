// 데이터베이스 생성 및 열기
function openDB(){
   db = window.openDatabase('maskDB', '1.0', '마스크DB', 1024*1024); 
   // console.log('1_DB 생성...'); 
} 

// 테이블 생성 트랜잭션 실행
function createTable() {
   db.transaction(function(tr){
      var sql_search_log = 'create table if not exists search_logs(id integer primary key autoincrement, name varchar(50))';       
      var sql_fav_restaurant = 'create table if not exists fav_restaurant(id integer primary key autoincrement, name varchar(50), addr varchar(50), lat real, lng real, memo text, contact varchar(20), ceo varchar(10), email text, description text, handle_coffee varchar(10), is_opened varchar(10))';
      var sql_system_vars = 'create table if not exists system_vars(id integer primary key autoincrement, name varchar(50), value varchar(50))';
      
      tr.executeSql(sql_search_log, [], function(){
         // console.log('search_log created...');        
      }, function(){
         console.log('Failed to create search_logs...');            
      });

      tr.executeSql(sql_fav_restaurant, [], function(){
         // console.log('fav_restaurant created...');        
      }, function(){
         console.log('Failed to create fav_restaurant...');            
      });
      
      tr.executeSql(sql_system_vars, [], function(){
         // console.log('system_vars created...');        
      }, function(){
         console.log('Failed to create system_vars...');            
      });

      reset_system_vars('is_saved', 'false');
   });
} 

// delete all location search logs
function purch_all(){ 
   db.transaction(function(tr){
      var name = $('#searchQuery').val();
       
      var sql1 = 'delete from search_logs';      
      var sql2 = 'delete from fav_restaurant';      
      var sql3 = 'delete from system_vars';      
      tr.executeSql(sql1, [], function(tr, rs){    
            // console.log('deleted search logs');    
      });
      tr.executeSql(sql2, [], function(tr, rs){    
         // console.log('deleted fav_restaurant');    
      });
      tr.executeSql(sql3, [], function(tr, rs){    
         // console.log('deleted system_vars');    
      });
   });      
}

// insert location search log
function insert_search_logs(){ 
   db.transaction(function(tr){
      var name = $('#searchQuery').val();
       
      var sql = 'insert into search_logs(name) values(?)';      
      tr.executeSql(sql, [name], function(tr, rs){    
         // console.log('search log inserted...no: ' + rs.insertId);    
      });
   });      
}

// delete fav_restaurant
function delete_fav_restaurant(phar){ 
   db.transaction(function(tr){
      // var code = phar.code;
      var addr = phar.addr;
      
      var sql = 'delete from fav_restaurant where addr = ?';

      tr.executeSql(sql, [addr], function(tr, rs){    
         // console.log(rs);
      }, function(){
         alert('failed to delete fav pharmacy');           
      });
   });      
}

// insert fav_restaurant
function insert_fav_restaurant(phar){ 
   db.transaction(function(tr){
      // console.log(phar);
      var name = phar.name;
      var addr = phar.addr;
      var contact = phar.contact;
      var ceo = phar.ceo;
      var email = phar.email;
      var description = phar.description;
      var handle_coffee = phar.handle_coffee;
      var is_opened = phar.is_opened;
      var lat = phar.lat;
      var lng = phar.lng;
      var memo = phar.memo;
      
      // var sql = 'insert into fav_restaurant(code, name, addr, lat, lng, remain_stat, memo) values(?, ?, ?, ?, ?, ?, ?)';
      var sql = 'insert into fav_restaurant(name, addr, contact, ceo, email, description, handle_coffee, is_opened, lat, lng, memo) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

      tr.executeSql(sql, [name, addr, contact, ceo, email, description, handle_coffee, is_opened, lat, lng, memo], function(tr, rs){    
         // console.log('fav pharmacies inserted...no: ' + rs.insertId);
      }, function(){
         alert('failed to insert pharmacy');           
      });
   });      
}

// update fav_restaurant
function update_fav_restaurant(phar){ 
   db.transaction(function(tr){
      // var id = phar.id;
      var name = phar.name;
      var addr = phar.addr;
      var contact = phar.contact;
      var ceo = phar.ceo;
      var email = phar.email;
      var description = phar.description;
      var handle_coffee = phar.handle_coffee;
      var is_opened = phar.is_opened;
      var lat = phar.lat;
      var lng = phar.lng;
      var memo = phar.memo;
      
      var sql = 'update fav_restaurant set name = ?, contact = ?, ceo = ?, email = ?, description = ?, handle_coffee = ?, is_opened = ?, lat = ?, lng = ?, memo = ? where addr = ?';

      tr.executeSql(sql, [name, contact, ceo, email, description, handle_coffee, is_opened, lat, lng, memo, addr], function(tr, rs){    
         // console.log(rs)
      }, function(){
         alert('failed to insert pharmacy');           
      });
   });      
}

// list fav_restaurant
function list_fav_restaurant(){ 
  
   // force to close previous modal before opening list fav pharmacies modal
   // console.log($('#phar_info_modal').length);
   if ($('#phar_info_modal').length > 0) {
      $('#phar_info_modal')[0].hidden = true;
   }

   db.transaction(function(tr){
      var sql = 'select * from fav_restaurant';

      tr.executeSql(sql, [], function(tr, rs){  
         var list_html = $('#list_html').val();
         // form1.reset();  
         count = rs.rows.length;
         if (count > 0) {
            // to pass object parameters to 'delete_phar_on_modal()' function 
            this.phar_arr = rs.rows; 
            var self = this;  	
            
            list_html = '<br><div >저장된 음식점 Total: <b>'+ count + '</b><br><br>' +
            // '<div id ="b" class="d-flex justify-content-center h-100">' +
            // '    <div class="search-memo"> ' +
            // '        <input type="text" class="search-memo-input" name="searchQuery" placeholder="메모로 검색">' +
            // '        <button class="search-memo-icon" type="submit" id="btn_search_location" onclick="getSearchQuery()"><i class="fa fa-search"></i></button>' +
            '    </div></div><br>';				
            for ( i = 0; i < count; i++ ) 
            {		console.log(rs.rows[i]);
               list_html += '<hr/>' + rs.rows[i].name + '<span style="margin-top:-6px !important;float:right;color:red;font-size:20px" onclick={delete_phar_index_on_modal('+i+')}><i class="fa fa-trash-o" aria-hidden="true"></i></span><br>'; 
               list_html += rs.rows[i].addr + '<br>'; 
               list_html += '<span style="margin-top:10px !important;color:#000">' + rs.rows[i].memo + '</span><br>상세사항: '; 
               list_html += rs.rows[i].description + '<br>커피 판매 여부: '; 
               list_html += rs.rows[i].handle_coffee + '<br>'; 
               list_html += '</div>';					
            }	
            $('#list_html').html(list_html);
         } else {
            list_html = '<br><div>저장된 음식점 없음<br><br></br>';
            $('#list_html').html(list_html);
         }
      }, function(){
         alert('failed to insert pharmacy');           
      });
   });      
}

// this function is to delete saved pharmacy from list_fav_phar
function delete_phar_index_on_modal(index){
   // console.log(index);
   // console.log(self.phar_arr[index]);
   delete_fav_restaurant(self.phar_arr[index]);
   // retrieve list of fav pharmacies
   list_fav_restaurant();
}

// retrieve fav_pharmacy to delete or insert
// kakao 내에서 웹이용시 내장DB 지원 안 해줘 only for chrome safari firefox (explorer도 안돼)
// 따로 DB 써주자 
function retrieve_fav_restaurant_modal_alert(phar, purpose, search_pharmacy){ 
   alert('before db trans');
   console.log('....');
   db.transaction(function(tr){
      // console.log(phar)
      alert('before exec');

      var code = phar.code;
      var sql = 'select * from fav_restaurant where code = ?';

      tr.executeSql(sql, [code], function(tr, rs){    
         // if the phar exists already,
         // retrieve or delete, else insert
         let temp_memo = '';
         alert('a');
         if (purpose == 'thumup') {
            alert('b');
            if (rs.rows.length > 0) {
               // delete
               delete_fav_restaurant(phar);
            } else {
               // insert new fav pharmacy
               insert_fav_restaurant(phar);
            }

            // to reload fav_restaurant_modal with updated pharmacy 
            retrieve_fav_restaurant_modal(phar, 'retrieve', '');
         } else {
            if (rs.rows.length > 0) {
               alert('c');
               // retrieve
               // to display
               temp_memo = rs.rows.item(0).memo;
               // console.log(rs.rows.item(0).memo);
               // to update DB
               $('#phar_memo').val(temp_memo);
            } 
         } //purpose for retrieve
         alert('d');

         let is_saved = false;
         if (rs.rows.length > 0) {
            is_saved = true;
         } 
         let content_changed;
         
         // to pass object parameter to 'add_fav_phar()' function 
         this.phar = phar; 
         var self = this; 

         if ( !is_saved ) {
            // modal
            content_changed = '<div id="phar_info_modal"  tabindex="-1" role="dialog" >' +
            '<div class="modal-dialog" role="document">' +
               '<div class="modal-content">' +
               '<div class="modal-header">' +
                  ' <h5 class="modal-title">' + phar.name +'<div onclick={add_fav_phar()} style="float:right;margin-left:10px;"><i class="fa fa-bookmark-o fa-2x" style="color:#8b929e" aria-hidden="true"></i></div></h5>' +
               '</div>' +
               '<div class="modal-body">' +
               '        <div> ' + phar.addr + '</div><br>' +
               '        <div> ' + phar.handle_coffee + '</div><br>' +
               '        <div> ' + phar.contact + '</div><br>' +
               '        <div> ' + phar.ceo + '</div><br>' +
               '        <div> ' + phar.email + '</div><br>' +
               '        <div> ' + phar.description + '</div><br>' +
               '        <div> ' + phar.is_opened + '</div><br>' +
               '                <div><a href="https://map.kakao.com/?q=' + search_pharmacy + '" target="_blank" class="link">카카오맵으로 보기</a></div>' + 
               '</div>' +
               '<div class="modal-footer">' +
                  '<button type="button" class="btn btn-secondary" onclick="closeModal()">닫기</button>' +
               '</div>' +
               "</div>" +
            '</div>' +
            '</div>';
         } else {
            // modal
            content_changed = '<div id="phar_info_modal" tabindex="-1" role="dialog" >' +
            '<div class="modal-dialog" role="document">' +
               '<div class="modal-content">' +
               '<div class="modal-header">' +
                  ' <h5 class="modal-title">' + phar.name +'<div onclick="add_fav_phar()" style="float:right;"><i class="fa fa-bookmark fa-2x" style="color:#4287f5;margin-left:10px;" aria-hidden="true"></i></div></h5>' +
               '</div>' +
               '<div class="modal-body">' +
               '        <div> ' + phar.addr + '</div><br>' +
               '        <div> ' + phar.handle_coffee + '</div><br>' +
               '        <div> ' + phar.contact + '</div><br>' +
               '        <div> ' + phar.ceo + '</div><br>' +
               '        <div> ' + phar.email + '</div><br>' +
               '        <div> ' + phar.description + '</div><br>' +
               '        <div> ' + phar.is_opened + '</div><br>' +
               '                <textarea style="width:100%;" cols="auto" rows="5" name="phar_memo" id="phar_memo" data-mini="true">' + temp_memo + '</textarea>	' + 
               // '                <textarea style="width:100%;" cols="auto" rows="5" name="phar_memo" id="phar_memo" data-mini="true">' + rs.rows.item(0).memo + '</textarea>	' + 
               '                <div><a href="https://map.kakao.com/?q=' + search_pharmacy + '" target="_blank" class="link">카카오맵으로 보기</a></div>' + 
               '</div>' +
               '<div class="modal-footer">' +
                  '<button type="button" class="btn btn-secondary" onclick="closeModal()">닫기</button>' +
               '<button type="button" class="btn btn-primary" onclick={change_phar_memo()}>저장</button>' +
               '</div>' +
               "</div>" +
            '</div>' +
            '</div>';
         }
         
         $('#phar_info_modal_test').html(content_changed);

      }, function(){
         alert('failed to use db');           
      });

   });  
   alert('after db trans')    
}

// retrieve fav_pharmacy to delete or insert
function retrieve_fav_restaurant_modal(phar, purpose, search_pharmacy){ 
   db.transaction(function(tr){
      // console.log(phar)

      var addr = phar.addr;
      var sql = 'select * from fav_restaurant where addr = ?';

      tr.executeSql(sql, [addr], function(tr, rs){    
         // if the phar exists already,
         // retrieve or delete, else insert
         let temp_memo = '';
         if (purpose == 'thumup') {
            if (rs.rows.length > 0) {
               // delete
               delete_fav_restaurant(phar);
            } else {
               // insert new fav pharmacy
               insert_fav_restaurant(phar);
            }

            // to reload fav_restaurant_modal with updated pharmacy 
            retrieve_fav_restaurant_modal(phar, 'retrieve', '');
         } else {
            if (rs.rows.length > 0) {
               // retrieve
               // to display
               temp_memo = rs.rows.item(0).memo;
               // console.log(rs.rows.item(0));
               // to update DB
               $('#phar_memo').val(temp_memo);
            } 
         } //purpose for retrieve

         let is_saved = false;
         if (rs.rows.length > 0) {
            is_saved = true;
         } 
         let content_changed;
         
         // to pass object parameter to 'add_fav_phar()' function 
         this.phar = phar; 
         var self = this; 

         if ( !is_saved ) {
            // modal
            content_changed = '<div id="phar_info_modal"  tabindex="-1" role="dialog" >' +
            '<div class="modal-dialog" role="document">' +
               '<div class="modal-content">' +
               '<div class="modal-header">' +
                  ' <h5 class="modal-title">' + phar.name +'<div onclick={add_fav_phar()} style="float:right;margin-left:10px;"><i class="fa fa-bookmark-o fa-2x" style="color:#8b929e" aria-hidden="true"></i></div></h5>' +
               '</div>' +
               '<div class="modal-body">' +
               '        <div> ' + phar.addr + '</div><br>' +
               '        <div>커피 판매 여부:  ' + phar.handle_coffee + '</div><br>' +
               '        <div>연락처:  <a href="tel:' + phar.contact + '">' + phar.contact + '</a></div><br>' +
               '        <div>대표 | 이메일:    ' + phar.ceo + '<a href="mailto:' + phar.email + '">' + phar.email + '</a></div><br>' +
               '        <div>상세사항: ' + phar.description + '</div><br>' +
               '        <div>영업여부: ' + phar.is_opened + '</div><br>' +
               '                <div><a href="https://map.kakao.com/?q=' + search_pharmacy + '" target="_blank" class="link">카카오맵으로 보기</a></div>' + 
               '</div>' +
               '<div class="modal-footer">' +
                  '<button type="button" class="btn btn-secondary" onclick="closeModal()">닫기</button>' +
               '</div>' +
               "</div>" +
            '</div>' +
            '</div>';
         } else {
            // modal
            content_changed = '<div id="phar_info_modal" tabindex="-1" role="dialog" >' +
            '<div class="modal-dialog" role="document">' +
               '<div class="modal-content">' +
               '<div class="modal-header">' +
                  ' <h5 class="modal-title">' + phar.name +'<div onclick="add_fav_phar()" style="float:right;"><i class="fa fa-bookmark fa-2x" style="color:#4287f5;margin-left:10px;" aria-hidden="true"></i></div></h5>' +
               '</div>' +
               '<div class="modal-body">' +
               '        <div> ' + phar.addr + '</div><br>' +
               '        <div>커피 판매 여부:  ' + phar.handle_coffee + '</div><br>' +
               '        <div>연락처:  <a href="tel:' + phar.contact + '">' + phar.contact + '</a></div><br>' +
               '        <div>대표 | 이메일:    ' + phar.ceo + '<a href="mailto:' + phar.email + '">' + phar.email + '</a></div><br>' +
               '        <div>상세사항: ' + phar.description + '</div><br>' +
               '        <div>영업 여부: ' + phar.is_opened + '</div><br>' +
               '                <textarea style="width:100%;" cols="auto" rows="5" name="phar_memo" id="phar_memo" data-mini="true">' + temp_memo + '</textarea>	' + 
               // '                <textarea style="width:100%;" cols="auto" rows="5" name="phar_memo" id="phar_memo" data-mini="true">' + rs.rows.item(0).memo + '</textarea>	' + 
               '                <div><a href="https://map.kakao.com/?q=' + search_pharmacy + '" target="_blank" class="link">카카오맵으로 보기</a></div>' + 
               '</div>' +
               '<div class="modal-footer">' +
                  '<button type="button" class="btn btn-secondary" onclick="closeModal()">닫기</button>' +
               '<button type="button" class="btn btn-primary" onclick={change_phar_memo()}>저장</button>' +
               '</div>' +
               "</div>" +
            '</div>' +
            '</div>';
         }
         
         $('#phar_info_modal_test').html(content_changed);

      }, function(){
         alert('failed to use db');           
      });

   });      
}

function change_phar_memo(event) {
   self.phar.memo = $('#phar_memo').val();
   update_fav_restaurant(self.phar);
   closeModal();
   // console.log(phar.memo);
}

function add_fav_phar(event) { 
   // Get worldText from the option passed into this tag from the parent: 
   // Or get worldText from the tag's current state 
   retrieve_fav_restaurant_modal(self.phar, 'thumup', '');
} 

function closeModal(){
   // hidden undifined
   if($('#phar_info_modal')[0].hidden != undefined) {
      let is_hidden = $('#phar_info_modal')[0].hidden;
      if (is_hidden) {
         $('#phar_info_modal')[0].hidden = false;
      } else {
         $('#phar_info_modal')[0].hidden = true;
      }
   }
}

// insert system_vars
function reset_system_vars(name, value){ 
   db.transaction(function(tr){
      // delete all system_vars
      var sql = 'delete from system_vars';
         tr.executeSql(sql, [], function(tr, rs){ 
      });

      sql = 'insert into system_vars(name, value) values(?, ?)';

      tr.executeSql(sql, [name, value], function(tr, rs){    
         // console.log('system_vars inserted...no: ' + rs.insertId);
      }, function(){
         alert('failed to insert system varaible');           
      });
   });      
}