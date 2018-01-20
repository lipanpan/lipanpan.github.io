package com.example;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by lipan on 2017/8/13.
 * Describe: Http协议模拟
 */
public class Http {

    // 回车换行符
    private static final String CRLF = "\r\n";

    // 默认的编码
    private static final String DEFAULT_CHARSET = "UTF-8";

    public static void main(String[] args) throws Exception {

        ByteArrayOutputStream data = new ByteArrayOutputStream();

        // body json数据
        byte[] requestBody = "{'name':'李盼','age':'26'}".getBytes(DEFAULT_CHARSET);

        // 写入请求行（协议及版本号,必须是大写的HTTP）
        String requestLine = "GET /lpp-web/v1/users/1 HTTP/1.1" + CRLF;
        data.write(requestLine.getBytes(DEFAULT_CHARSET));

        // 写入请求头, 冒号:后面含空格，例如[Connection: keep-alive]
        StringBuilder requestHeaders = new StringBuilder();
        requestHeaders.append("Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp," +
                "image/apng,*/*;q=0.8").append(CRLF)
                .append("Accept-Encoding: gzip, deflate, br").append(CRLF)
                .append("Accept-Language: zh-CN,zh;q=0.8").append(CRLF)
                .append("Connection: keep-alive").append(CRLF)
                .append("Host: 127.0.0.1").append(CRLF)
                .append("Cache-Control: max-age=0").append(CRLF)
                .append("Upgrade-Insecure-Requests: 1").append(CRLF)
                .append("User-Agent: lipan-http").append(CRLF)
                .append("Content-Type: application/json").append(CRLF)
                .append("Content-Length: " + requestBody.length).append(CRLF);

        data.write(requestHeaders.toString().getBytes(DEFAULT_CHARSET));

        // 写入请求头与请求体CRLF分隔符
        data.write(CRLF.getBytes());

        // 写入请求体
        data.write(requestBody);

        byte[] httpData = data.toByteArray();

        // 发送Http请求
        Socket socket = new Socket();
        socket.connect(new InetSocketAddress("127.0.0.1", 80));
        socket.setKeepAlive(true);
        socket.setSoTimeout(50000);
        socket.setTcpNoDelay(false);

        InputStream in = socket.getInputStream();
        OutputStream out = socket.getOutputStream();
        out.write(httpData);

        // 解析响应结果
        LineNumberReader reader = new LineNumberReader(new InputStreamReader(in, DEFAULT_CHARSET));
        // 解析响应行
        processResponseLine(reader.readLine());

        // 解析响应头
        String headerLine;
        Map<String, Object> headerMap = new HashMap<String, Object>();
        while(!(headerLine = reader.readLine()).equals("")) {
            processResponseHeader(headerMap, headerLine);
        }

        // 解析响应体
        int responseContentLen = 0;
        if(headerMap.containsKey("Content-Length")) {
            responseContentLen = Integer.parseInt(headerMap.get("Content-Length").toString());
        }
        if(responseContentLen > 0) {
            byte[] body = new byte[responseContentLen];
            int i = 0;
            int v = -1;
            while((v = reader.read()) != -1) {
                body[i] = (byte) v;
                i++;
            }
            System.out.println("响应体Body: " + new String(body, DEFAULT_CHARSET));
        }

        // 关闭系统资源
        socket.close();
    }

    /**
     * 解析响应行
     * @param responseLine
     */
    private static void processResponseLine(String responseLine) {
        String[] datas = responseLine.split("\\s"); // 空格拆分
        System.out.println("responseLine protocol: " + datas[0]);
        System.out.println("responseLine code: " + datas[1]);
        if(datas.length == 3) {
            System.out.println("responseLine msg: " + datas[2]);
        }
    }

    /**
     * 解析响应头，Content-Length: 67等
     * @param headerMap
     * @param responseLine
     */
    private static void processResponseHeader(Map<String, Object> headerMap, String responseLine) {
        String[] datas = responseLine.split(": "); // 冒号空格拆分
        headerMap.put(datas[0], datas[1]);
        System.out.println(datas[0] + ": " + datas[1]);
    }

}
