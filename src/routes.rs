/// ルートモジュール
/// 
/// ToDOアプリのルーティングロジックを定義
/// HTTPリクエストの処理を担当し、ToDoアイテムの追加、取得、更新、削除などを実施
/// 
/// 
/// 使用するフレームワークとライブラリ：
/// - Warp: 軽量なWebサーバーフレームワーク
/// - Tokio: 非同期I/Oを提供するランタイム
/// - Arc: 複数のスレッドで同じデータを共有
/// - Mutex: 一度に一つのスレッドだけがデータにアクセスできるような排他ロック
/// - HashMap: データの動的管理、高速な探索とアクセスのため

use warp::Filter;
use crate::models::TodoItem;
use std::sync::{Arc, Mutex};
use std::collections::HashMap;

pub fn routes(db: Arc<Mutex<HashMap<u32, TodoItem>>>) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    // ルートパスへのGETリクエストに対応するフィルタ
   let get_index = warp::get()
   .and(warp::path::end())
   .map(|| warp::reply::html(include_str!("../static/index.html"))); 

   // staticパスに対応するリクエストに対して、staticディレクトリの静的ファイルを提供するフィルタ
   let static_file = warp::path("static")
   .and(warp::fs::dir("static"));

   // todosパスに対応するPOSTリクエストに対して、todoitemを追加する
   let add_todo = warp::post()
   .and(warp::path("todos"))
   .and(warp::body::json())
   .and(with_db(db.clone()))
   .map(|mut new_todo: TodoItem, db:Arc<Mutex<HashMap<u32, TodoItem>>>| {
    let mut db = db.lock().unwrap();
    let new_id = (db.len() as u32) + 1;
    new_todo.id = Some(new_id);
    db.insert(new_id, new_todo);
    warp::reply::with_status("Todo added", warp::http::StatusCode::CREATED)
   });

   //  todoパスに対応するGETリクエストに対して、全てのToDoアイテムを取得
   let get_todos = warp::get()
   .and(warp::path("todos"))
   .and(with_db(db.clone()))
   .map(|db: Arc<Mutex<HashMap<u32, TodoItem>>>| {
    let db = db.lock().unwrap();
    let todos: Vec<TodoItem> = db.values().cloned().collect();
    warp::reply::json(&todos)
   });
   get_index.or(static_file).or(add_todo).or(get_todos)
}

/// `with_db` 関数は、共有データベース (`Arc<Mutex<HashMap<u32, TodoItem>>>`) を
/// リクエストハンドラに渡すための Warp フィルタを生成
/// このフィルタは、全てのリクエストに対して同じデータベースのクローンを提供し、
/// 安全に並行処理を行うために Arc と Mutex を使用
///
/// # 引数
/// - `db`: Todoアイテムを保持する共有データベースへの参照をラップした `Arc<Mutex<HashMap<u32, TodoItem>>>`。
///
/// # 戻り値
/// - `impl Filter<Extract = (Arc<Mutex<HashMap<u32, TodoItem>>>,), Error = Infallible> + Clone`:
///   共有データベースを提供する Warp フィルタ。/ 
fn with_db(db: Arc<Mutex<HashMap<u32, TodoItem>>>) -> impl Filter<Extract = (Arc<Mutex<HashMap<u32, TodoItem>>>,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || db.clone())
}