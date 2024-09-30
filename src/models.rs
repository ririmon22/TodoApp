/// モデルモジュール
/// 
/// アプリケーションで使用するデータモデルを定義
/// モデルは構造体で定義し、データのシリアライズやデシリアライズのための
/// Serdeトレイトを実装する
/// 
/// 使用するフレームワークとライブラリ：
/// - chrono: 日付確保のため
/// - serde: Todo構造体をJSON形式に変更するため

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum Priority {
    Low,
    Medium,
    High,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TodoItem {
    pub id: Option<u32>,  //追加時にIDが自動更新されるようにするためOption型に
    pub title: String,
    pub completed: bool,
    pub priority: Priority,
}