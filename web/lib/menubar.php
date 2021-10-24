<?php
    session_start();
    $isLogin = (bool)$_SESSION['id']
    ?>
    <table border="0">
            <tr>
                <td>
                    <div id="Menu">
                        <input type="checkbox" id="Check">
                        <label id="Open" for="Check"><img src="/lib/img/menu2.png" alt="メニュー" width="50" height="50"></label>
                        <label id="Close" for="Check"></label>
                        <nav>
                            <ul>
                                <?php if ($isLogin) {?>
                                <li><a href="/home">ホーム</a></li>
                                <li><a href="/checkin">QRコードスキャン</a></li>
                                <li><a href="/checkin/use-form.php">入室手動入力</a></li>
                                <?php }?>
                                <li><?php echo $isLogin ? '<a href="/logout">ログアウト</a></li>' :'<a href="/login">ログイン</a></li>' ?>
                                <li><a href="https://github.com/taikis/MiNERVA">MiNERVA概要</a></li>
                                <li><a href="https://hosei-u.com/">企画実行委員会ホームページ</a></li>
                                <li><a href="https://koganeisai.hosei-u.com/">小金井祭ホームページ</a></li>
                            </ul>
                        </nav>
                    </div>
                </td>
                <td><a href="https://hosei-u.com/"><div class="icon"><img src="/lib/img/kikaku.JPG"></div></a></td>
            </tr>
        </table>