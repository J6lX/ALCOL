package com.alcol.userservice.util;

import com.alcol.userservice.entity.UserEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
@Slf4j
public class FileHandler
{
    private final ResourceLoader resourceLoader;

    public FileHandler(ResourceLoader resourceLoader)
    {
        this.resourceLoader = resourceLoader;
    }

    public boolean parseFileInfo(MultipartFile multipartFile, UserEntity userEntity) throws IOException {
        // 파일 이름을 업로드 한 날짜로 바꾸어서 저장
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
//        String currentDate = simpleDateFormat.format(new Date());

        // 프로젝트 폴더에 저장하기 위해 절대경로를 설정
//        String absolutePath = new File("").getAbsolutePath();

//        log.info("absolute path : " + absolutePath);

//        String relativeFolder = resourceLoader.getResource(
//                "classpath:" + File.separator + "myStatic"
//        ).getURI().getPath();

//                + "resources"
//                + File.separator + "static"
//                + File.separator + "images"
//                + File.separator + currentDate;

        URL relativeFolder = FileHandler.class.getClassLoader().getResource(".");

        log.info("relativeFolder : " + relativeFolder);

        // 경로를 지정하고 그곳에 저장
//        String path = "images/" + currentDate;
        File file = new File(relativeFolder.getPath());

        // 저장할 위치의 디렉토리가 존재하지 않을 경우
        if (!file.exists())
        {
            // mkdir() 함수와 다른 점은 상위 디렉토리가 존재하지 않을 때 그것까지 생성
            file.mkdirs();
        }

        // 파일이 비어있는 경우
        if (multipartFile.isEmpty())
        {
            return false;
        }

        String contentType = multipartFile.getContentType();
        String originalFileExtension = null;

        // 확장자 명이 없으면 이 파일은 잘못된 것이다
        if (ObjectUtils.isEmpty(contentType))
        {
            return false;
        }

        // jpeg, png 파일만 처리
        if (contentType.contains("image/jpeg"))
        {
            originalFileExtension = ".jpg";
        }
        else if (contentType.contains("image/png"))
        {
            originalFileExtension = ".png";
        }

        // 각 이름은 겹치면 안되므로 나노 초까지 동원하여 지정
        String new_file_name = System.nanoTime() + originalFileExtension;

        // 저장된 파일로 변경하여 이를 보여주기 위함
        file = new File(relativeFolder + File.separator + new_file_name);

        // 파일을 저장
        try {
            multipartFile.transferTo(file);
        } catch(Exception e) {
            e.printStackTrace();
            return false;
        }

        userEntity.setOriginalFileName(multipartFile.getOriginalFilename());
        userEntity.setStoredFileName(new_file_name);
        userEntity.setFileSize(multipartFile.getSize());

        return true;
    }

}
