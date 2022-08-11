import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import theme from '../../styles/themes';
import { Avatar, Icon, Text, Tag } from '../index';
import CardBack from './CardBack/CardBack';
import * as S from './Card.style';
import { Folder } from '../../shared/DummyDataType';
import { getFolder } from '../../apis/FolderAPI';
import { SpecificFolder } from '../../types';

interface Props {
  data: Folder;
  version?: string;
  shrinking?: boolean;
}

const defaultProps = {
  data: {},
  version: 'default',
  shrinking: true,
};

const Card = ({ data, version, shrinking, ...styles }: Props) => {
  const author = data.user.name;
  const authorImage = data.user.image;
  const { isPinned } = data;
  const router = useRouter();
  const [reverseCard, setReverseCard] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  const handleRotateCard = () => {
    setReverseCard(!reverseCard);
  };

  const moveFolderDetailPage = () => {
    router.push(`/folderdetail/${data.id}`);
  };

  // 임시로 북마크 불러오기
  useEffect(() => {
    if (version !== 'default') return;

    const fetch = async () => {
      const res: SpecificFolder = await getFolder(data.id);
      setBookmarks(res.bookmarks);
    };
    fetch();
  }, []);

  return (
    <S.Container>
      <S.Card version={version} reverseCard={reverseCard} {...styles}>
        <S.ContentContainer
          onClick={
            version === 'default' ? handleRotateCard : moveFolderDetailPage
          }
        >
          <S.ImageWrapper version={version}>
            <Image
              className="image"
              width="300px"
              height={206}
              src={data.image}
              layout="responsive"
            />
          </S.ImageWrapper>
          <S.Content version={version}>
            {isPinned && (
              <S.IconWrapper>
                <Icon name="pin_blue_ic" size={25} />
              </S.IconWrapper>
            )}
            {version === 'myCard' && (
              <S.StatusWrapper>
                <S.StatusText>Public</S.StatusText>
              </S.StatusWrapper>
            )}
            <S.TitleWrapper>
              <S.Title>{data.title}</S.Title>
            </S.TitleWrapper>
            <S.TagWrapper>
              <Tag tagItems={data.tags!} shrinking={shrinking} />
            </S.TagWrapper>
            <S.Info version={version}>
              <Avatar name={author} src={authorImage} />
              <div>
                <Text size={theme.fontSize.c[1]}>
                  {data.createdAt.split('T')[0]}
                </Text>
                {version === 'othersCard' && (
                  <S.Likes>
                    <Icon name="likesFill" size={16} />
                    <Text size={theme.fontSize.c[1]}>{data.likes}</Text>
                  </S.Likes>
                )}
              </div>
            </S.Info>
          </S.Content>
        </S.ContentContainer>
        {version === 'default' && (
          <S.LinkWrapper>
            <Link href={`/user/${data.user.id}`}>
              <S.StyledLink>북마크 확인하기 ▶</S.StyledLink>
            </Link>
          </S.LinkWrapper>
        )}
      </S.Card>
      {version === 'default' && (
        <CardBack
          data={bookmarks}
          handleRotateCard={handleRotateCard}
          reverseCard={reverseCard}
        />
      )}
    </S.Container>
  );
};

Card.defaultProps = defaultProps;

export default Card;
