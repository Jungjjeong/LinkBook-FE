import * as S from '../../Modal.style';
import { Button, Input } from '../../../index';
import { MouseEventHandler, useCallback, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useUserInfo } from '../contexts/UserProvider';

interface Props {
  handlePage: MouseEventHandler;
}

interface EmailInput {
  email: string;
}

const Page01 = ({ handlePage }: Props) => {
  const [emailValue, setEmailValue] = useState('');
  const { setEmail } = useUserInfo();
  const codeRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailInput>();

  const onSubmit: SubmitHandler<EmailInput> = useCallback((data) => {
    const { email } = data;
    setEmailValue(email);
  }, []);

  const onValidateCode = () => {
    // 이메일 인증 과정 거쳐 전역에 email 저장
    setEmail(emailValue);
  };

  return (
    <S.InnerContainer onSubmit={handleSubmit(onSubmit)}>
      <S.Title>
        <S.MainText>Linkbook</S.MainText>에 처음 오셨군요! 🎉
        <br />
        사용할 <S.MainText>아이디</S.MainText>를 입력해 주세요.
        <S.Description>이메일 형식으로 입력해 주세요!</S.Description>
      </S.Title>
      <S.InputContainer>
        <div>
          <Input
            placeholder="아이디(이메일)"
            type="text"
            {...register('email', {
              required: '이메일은 필수 입력입니다.',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: '이메일 형식에 맞지 않습니다.',
              },
            })}
          >
            <Button type="submit" version="modal">
              인증번호 발송
            </Button>
          </Input>
          {errors.email && (
            <S.errorText role="alert">{errors.email.message}</S.errorText>
          )}
        </div>
        <div>
          <Input
            placeholder="이메일로 발송된 6자리 인증 코드를 입력해주세요."
            type="number"
            ref={codeRef}
          >
            <Button type="button" version="modal" onClick={onValidateCode}>
              인증
            </Button>
          </Input>
        </div>
      </S.InputContainer>
      <S.ButtonContainer>
        <Button type="button" onClick={handlePage}>
          다음 &gt;
        </Button>
      </S.ButtonContainer>
    </S.InnerContainer>
  );
};

export default Page01;
