interface ContactFormData {
  message: string;
  name: string;
  position: string;
  phone: string;
  email: string;
}

interface PresentationFormData {
  name: string;
  email: string;
}

interface VacancyFormData {
  name: string;
  phone: string;
  email: string;
  vacancyName: string;
  resumeLink: string;
  resumeFile: File;
}

export const useFormApi = () => {
  const sendContactForm = async (data: ContactFormData) => {
    const formData = new FormData();
    formData.append('message', data.message);
    formData.append('name', data.name);
    formData.append('position', data.position);
    formData.append('phone', data.phone);
    formData.append('email', data.email);

    try {
      const response = await fetch('/api/mail/index.php', {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text);
      }

      return { success: true, message: text };
    }
    catch (error) {
      console.error('Ошибка отправки контактной формы:', error);
      throw error;
    }
  };

  const sendPresentationForm = async (data: PresentationFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);

    try {
      const response = await fetch('/api/mail/presentation.php', {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text);
      }

      return { success: true, message: text };
    }
    catch (error) {
      console.error('Ошибка отправки формы презентации:', error);
      throw error;
    }
  };

  const sendVacancyForm = async (data: VacancyFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('email', data.email);
    formData.append('vacancyName', data.vacancyName);
    formData.append('resumeLink', data.resumeLink);
    formData.append('resumeFile', data.resumeFile);

    try {
      const response = await fetch('/api/mail/vacancy.php', {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text);
      }

      return { success: true, message: text };
    }
    catch (error) {
      console.error('Ошибка отправки формы отклика:', error);
      throw error;
    }
  };

  return {
    sendContactForm,
    sendPresentationForm,
    sendVacancyForm,
  };
};
