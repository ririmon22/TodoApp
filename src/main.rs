/// アプリケーションのエントリーポイント
/// 
/// アプリケーションのメインロジックを定義
/// ToDoアイテムの初期化、ルーティングの設定、サーバーの起動を実施
/// 
/// 使用するフレームワークとライブラリ：
/// - Warp: 軽量なWebサーバーフレームワーク
/// - Tokio: 非同期I/Oを提供するランタイム
/// - Arc: 複数のスレッドで同じデータを共有
/// - Mutex: 一度に一つのスレッドだけがデータにアクセスできるような排他ロック
/// - HashMap: データの動的管理、高速な探索とアクセスのため
/// 

use warp;
use std::sync::{Arc, Mutex};
use std::collections::HashMap;

mod models;
mod routes;

#[tokio::main]
async fn main() {
    let db: Arc<Mutex<HashMap<u32, models::TodoItem>>> = Arc::new(Mutex::new(HashMap::new()));

    let api = routes::routes(db.clone());

    warp::serve(api).run(([127,0,0,1], 3030)).await;
}