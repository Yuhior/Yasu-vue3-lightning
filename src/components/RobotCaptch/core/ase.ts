import CryptoJS from 'crypto-js'
/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
export function aesEncrypt(word,keyWord="XwKsGlMcdPMEhR1B"){
	const key = CryptoJS.enc.Utf8.parse(keyWord);
	const srcs = CryptoJS.enc.Utf8.parse(word);
	const encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
	return encrypted.toString();
}
/**
 * AES 解密
 * @cipherText {String} 加密后的字符串
 * @keyWord {String} 服务器随机返回的关键字
 * @return {String} 解密后的内容
 */
export function aesDecrypt(cipherText, keyWord = "XwKsGlMcdPMEhR1B") {
	const key = CryptoJS.enc.Utf8.parse(keyWord); // 解密使用的密钥
	const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
		mode: CryptoJS.mode.ECB, // 模式与加密时保持一致
		padding: CryptoJS.pad.Pkcs7, // 填充方式与加密时保持一致
	});
	// 转换为 UTF-8 字符串
	return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 增加--- 的解密
 * @param captchaVerification
 * @param secretKey
 * @returns {{backToken: string, checkPosArr: any}|{backToken: *, checkPosArr: any}}
 */
export  function extractCaptchaData(captchaVerification, secretKey) {
	// 如果没有 secretKey，直接返回未加密数据
	if (!secretKey) {
		const [backToken, checkPosArr] = captchaVerification.split('---');
		return { backToken, checkPosArr: JSON.parse(checkPosArr) };
	}

	// 解密加密的数据
	const decrypted = aesDecrypt(captchaVerification, secretKey);

	// 拆分解密后的数据
	const [backToken, checkPosArr] = decrypted.split('---');
	// 返回结果
	return {
		backToken,
		checkPosArr: secretKey ? aesEncrypt(checkPosArr, secretKey) : JSON.stringify(checkPosArr), // 转为对象
	};
}
