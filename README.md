# MiNERVA

<div align="center">
<img src="https://user-images.githubusercontent.com/60678028/144098618-e6d5ad57-76b2-4993-8f4c-9ca6fdadea67.png" width="500px">
</div>
  
来場者の行動履歴を追跡することができる、入室管理システムです。  
運営側はブラウザからアクセスし、QRを読み取るだけで来場者の追跡ができます。  
学祭や新入生歓迎会など、会場の中で来場者がある程度動くイベントで使用します。

## サーバ側

`web/`以下をサーバに格納してください。  
その後、`.env.sample`を実際の環境変数に治して`.env`ファイルを作成してください。  
[phpdotenv](https://github.com/vlucas/phpdotenv)を用いています。  

## QRコードの作成

来場者にお渡しする、IDの入ったQRコードの自動生成ツールです。  
`QRcodeMaker/`をローカルPCに格納してください。  
LaTeX・Python環境で動きます。一部UNIXコマンドを使用しています。


## 使用したライブラリ

[**jsQR**](https://github.com/cozmo/jsQR)  
by Cosmo Wolfe  
([Apache-2.0 License](https://github.com/cozmo/jsQR/blob/master/LICENSE))

[**Grid.js**](https://github.com/grid-js/gridjs)  
Copyright (c) Afshin Mehrabani afshin.meh@gmail.com  
([MIT License](https://github.com/grid-js/gridjs/blob/master/LICENSE))

## 使用にあたって

全力でサポートいたします。[@taikis_jp](https://twitter.com/taikis_jp)までご連絡ください。  
また、このシステムのソースコードはGPL-3.0 Licenseで誰でも使用できます。  

## contribute

環境によって動かないなど、さまざまな問題があります。   
PR, Issueの起票お待ちしています。  

共同開発者 : [@nobu-ryo](https://github.com/nobu-ryo)
