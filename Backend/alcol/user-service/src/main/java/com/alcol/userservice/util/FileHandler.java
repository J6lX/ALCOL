package com.alcol.userservice.util;

import com.alcol.userservice.entity.UserEntity;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
@Slf4j
public class FileHandler
{
    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String S3Bucket;

    public FileHandler(AmazonS3Client amazonS3Client)
    {
        this.amazonS3Client = amazonS3Client;
    }

    public boolean parseFileInfo(MultipartFile multipartFile, UserEntity userEntity) throws IOException
    {
        // 파일 이름을 업로드 한 날짜로 바꾸어서 저장
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
        String currentDate = simpleDateFormat.format(new Date());

        String contentType = multipartFile.getContentType();
        String originalFileExtension = null;
        long size = multipartFile.getSize();

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

        String newFileName = currentDate + System.nanoTime() + originalFileExtension;

        ObjectMetadata objectMetaData = new ObjectMetadata();
        objectMetaData.setContentType(multipartFile.getContentType());
        objectMetaData.setContentLength(size);

        // S3에 업로드
        amazonS3Client.putObject(
                new PutObjectRequest(S3Bucket, newFileName, multipartFile.getInputStream(), objectMetaData)
                        .withCannedAcl(CannedAccessControlList.PublicRead)
        );

        // 접근가능한 URL 가져오기
        String imagePath = amazonS3Client.getUrl(S3Bucket, newFileName).toString();

        log.info(imagePath);

        userEntity.setOriginalFileName(multipartFile.getOriginalFilename());
        userEntity.setStoredFileName(imagePath);
        userEntity.setFileSize(multipartFile.getSize());

        return true;
    }

}
